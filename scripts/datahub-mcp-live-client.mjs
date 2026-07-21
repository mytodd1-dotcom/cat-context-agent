import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultUvx = resolve(root, ".datahub-py313/bin/uvx");
const uvx = process.env.DATAHUB_MCP_UVX ?? defaultUvx;
const mcpVersion = process.env.DATAHUB_MCP_VERSION ?? "0.6.0";
const transport = process.env.DATAHUB_MCP_TRANSPORT ?? "docker";
const docker = process.env.DOCKER_BIN ?? "/Applications/Docker.app/Contents/Resources/bin/docker";
const gmsUrl = process.env.DATAHUB_GMS_URL ??
  (transport === "docker" ? "http://datahub-gms-quickstart:8080" : "http://localhost:8080");
const gmsToken = process.env.DATAHUB_GMS_TOKEN ?? "datahub";
const isMutationEnabled = process.argv.includes("--enable-mutations");

function assertTarget(value, name) {
  if (!value) throw new Error(`${name} is required. Pass ${name}=<value>.`);
  return value;
}

function getOption(name) {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
}

class StdioMcpClient {
  #nextId = 1;
  #pending = new Map();

  constructor(child, stderr = []) {
    this.child = child;
    child.once("exit", (code, signal) => {
      const error = new Error(
        `Official DataHub MCP server exited before the request completed (code=${code}, signal=${signal ?? "none"}). ${stderr.join("").trim()}`,
      );
      for (const { reject } of this.#pending.values()) reject(error);
      this.#pending.clear();
    });
    const lines = createInterface({ input: child.stdout });
    lines.on("line", (line) => {
      try {
        const message = JSON.parse(line);
        if (message.id && this.#pending.has(message.id)) {
          const { resolve: finish, reject } = this.#pending.get(message.id);
          this.#pending.delete(message.id);
          if (message.error) reject(new Error(`${message.error.code}: ${message.error.message}`));
          else finish(message.result);
        }
      } catch {
        // MCP server log lines can be written to stdout by older versions. Ignore non-JSON lines.
      }
    });
  }

  request(method, params) {
    const id = this.#nextId++;
    const payload = { jsonrpc: "2.0", id, method, params };
    return new Promise((resolveRequest, rejectRequest) => {
      this.#pending.set(id, { resolve: resolveRequest, reject: rejectRequest });
      this.child.stdin.write(`${JSON.stringify(payload)}\n`);
    });
  }

  notify(method, params) {
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
  }

  close() {
    this.child.kill("SIGTERM");
  }
}

function startServer() {
  const command = transport === "docker" ? docker : uvx;
  const args = transport === "docker"
    ? [
        "run", "--rm", "-i", "--network", "datahub_network",
        "-e", `DATAHUB_GMS_URL=${gmsUrl}`,
        "-e", `DATAHUB_GMS_TOKEN=${gmsToken}`,
        // The local quickstart stack has no telemetry service. Disabling optional
        // client telemetry keeps the official MCP server focused on DataHub reads.
        "-e", "DATAHUB_TELEMETRY_ENABLED=false",
        "-e", `TOOLS_IS_MUTATION_ENABLED=${isMutationEnabled ? "true" : "false"}`,
        `cat-datahub-mcp:${mcpVersion}`,
      ]
    : [`mcp-server-datahub@${mcpVersion}`];
  const child = spawn(command, args, {
    env: {
      ...process.env,
      DATAHUB_GMS_URL: gmsUrl,
      DATAHUB_GMS_TOKEN: gmsToken,
      DATAHUB_TELEMETRY_ENABLED: "false",
      TOOLS_IS_MUTATION_ENABLED: isMutationEnabled ? "true" : "false",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  const stderr = [];
  child.stderr.on("data", (chunk) => stderr.push(chunk.toString()));
  child.once("error", (error) => stderr.push(`Unable to start official DataHub MCP server: ${error.message}`));
  return { child, stderr };
}

export async function listLiveDataHubTools() {
  const { child, stderr } = startServer();
  const client = new StdioMcpClient(child, stderr);
  try {
    await client.request("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "cat-context-agent", version: "0.2.0" },
    });
    client.notify("notifications/initialized");
    const toolResult = await client.request("tools/list", {});
    return {
      mode: "live-official-datahub-mcp",
      server: `mcp-server-datahub@${mcpVersion}`,
      gms_url: gmsUrl,
      mutations_enabled: isMutationEnabled,
      tools: (toolResult.tools ?? []).map((tool) => ({
        name: tool.name,
        destructive: Boolean(tool.annotations?.destructiveHint),
        read_only: Boolean(tool.annotations?.readOnlyHint),
        input_schema: tool.inputSchema,
      })),
      stderr: stderr.join("").trim(),
    };
  } finally {
    client.close();
  }
}

export async function inspectLiveSchemaAndLineage({ urn = getOption("--urn") } = {}) {
  const targetUrn = assertTarget(urn, "--urn");
  const { child, stderr } = startServer();
  const client = new StdioMcpClient(child, stderr);
  try {
    await client.request("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "cat-context-agent", version: "0.2.0" },
    });
    client.notify("notifications/initialized");
    const [entities, schema, lineage] = await Promise.all([
      client.request("tools/call", { name: "get_entities", arguments: { urns: [targetUrn] } }),
      client.request("tools/call", { name: "list_schema_fields", arguments: { urn: targetUrn } }),
      client.request("tools/call", { name: "get_lineage", arguments: { urn: targetUrn, upstream: true, max_hops: 2 } }),
    ]);
    return { mode: "live-official-datahub-mcp", urn: targetUrn, entities, schema, lineage };
  } finally {
    client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = getOption("--urn")
    ? await inspectLiveSchemaAndLineage()
    : await listLiveDataHubTools();
  console.log(JSON.stringify(result, null, 2));
}
