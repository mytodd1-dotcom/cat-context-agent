#!/usr/bin/env python3
"""Seed a tiny, explicit catalog for the live DataHub MCP demonstration.

This is demo metadata only: an upstream raw orders dataset and a downstream
daily revenue dataset with an intentionally undocumented `net_revenue` field.
CAT reads this through the official DataHub MCP server and proposes a bounded
remediation packet; it never changes production metadata automatically.
"""

from datahub.emitter.mce_builder import make_data_platform_urn, make_dataset_urn
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.emitter.rest_emitter import DataHubRestEmitter
from datahub.metadata.schema_classes import (
    DatasetLineageTypeClass,
    DatasetPropertiesClass,
    NumberTypeClass,
    OtherSchemaClass,
    SchemaFieldClass,
    SchemaFieldDataTypeClass,
    SchemaMetadataClass,
    StringTypeClass,
    UpstreamClass,
    UpstreamLineageClass,
)

GMS = "http://localhost:8080"
TOKEN = "datahub"
PLATFORM = "demo"
ENV = "PROD"


def schema_field(path, data_type, native_type, description=None):
    return SchemaFieldClass(
        fieldPath=path,
        type=SchemaFieldDataTypeClass(type=data_type),
        nativeDataType=native_type,
        description=description,
        nullable=True,
    )


def emit_dataset(emitter, urn, name, description, fields):
    emitter.emit_mcp(
        MetadataChangeProposalWrapper(
            entityUrn=urn,
            aspect=DatasetPropertiesClass(name=name, description=description),
        )
    )
    emitter.emit_mcp(
        MetadataChangeProposalWrapper(
            entityUrn=urn,
            aspect=SchemaMetadataClass(
                schemaName=name,
                platform=make_data_platform_urn(PLATFORM),
                version=0,
                hash=f"cat-remediation-demo-{name}",
                platformSchema=OtherSchemaClass(rawSchema="demo schema"),
                fields=fields,
            ),
        )
    )


def main():
    emitter = DataHubRestEmitter(GMS, token=TOKEN)
    raw_orders = make_dataset_urn(PLATFORM, "commerce.raw_orders", ENV)
    daily_revenue = make_dataset_urn(PLATFORM, "analytics.daily_revenue", ENV)

    emit_dataset(
        emitter,
        raw_orders,
        "commerce.raw_orders",
        "Source order events used by the daily revenue model.",
        [
            schema_field("order_id", StringTypeClass(), "VARCHAR", "Stable order identifier."),
            schema_field("order_total", NumberTypeClass(), "DECIMAL", "Gross order total in USD."),
            schema_field("order_date", StringTypeClass(), "DATE", "UTC order date."),
        ],
    )
    emit_dataset(
        emitter,
        daily_revenue,
        "analytics.daily_revenue",
        "Daily revenue aggregate consumed by executive reporting.",
        [
            schema_field("revenue_date", StringTypeClass(), "DATE", "UTC aggregation date."),
            # Deliberately blank: this is the safe, visible remediation target.
            schema_field("net_revenue", NumberTypeClass(), "DECIMAL"),
            schema_field("order_count", NumberTypeClass(), "BIGINT", "Number of included orders."),
        ],
    )
    emitter.emit_mcp(
        MetadataChangeProposalWrapper(
            entityUrn=daily_revenue,
            aspect=UpstreamLineageClass(
                upstreams=[
                    UpstreamClass(
                        dataset=raw_orders,
                        type=DatasetLineageTypeClass.TRANSFORMED,
                    )
                ]
            ),
        )
    )
    print(daily_revenue)


if __name__ == "__main__":
    main()
