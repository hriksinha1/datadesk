# Homepage Claims Audit

| Claim in the previous marketing surface | Repository evidence | Verdict |
| --- | --- | --- |
| “Zero double bookings” / instant availability | No overlap-prevention guarantee was located in booking or calendar code; the language appeared in the former [CalendarShowcaseSection](../../src/components/marketing/CalendarShowcaseSection.tsx). | Removed; no absolute guarantee. |
| Check-in under 60 seconds | No measurement or timing instrumentation found in the former [PropertyTypesSection](../../src/components/marketing/PropertyTypesSection.tsx). | Removed. |
| GST-compliant PDF / automatic CGST, SGST, IGST | Booking data supports a configurable tax rate and invoice code renders tax information in [pdfGenerator.ts](../../src/lib/services/pdfGenerator.ts); compliance and automatic jurisdictional breakdown claims were not established. | Removed from the homepage; do not restore without product/legal review. |
| Guest identity documents / ID tracking | The guest and customer model in [types.ts](../../src/lib/repository/types.ts) contains contact details, not uploaded ID documents. | Removed. |
| Cash-drawer reconciliation / shift handovers | No cash drawer or shift-handover workflow was found; the claim appeared in the former [FeatureDeepDive](../../src/components/marketing/FeatureDeepDive.tsx). | Removed. |
| Property-specific GSTIN, address and check-in details | These fields exist in the property model and Appwrite schema; see [types.ts](../../src/lib/repository/types.ts) and [APPWRITE_SETUP.md](../../APPWRITE_SETUP.md). | Kept only as a capability boundary; no homepage promise about tax compliance. |
| Single-click property scope | A property context selector exists in [WorkspaceDataContext.tsx](../../src/context/WorkspaceDataContext.tsx) and [PropertyContext.tsx](../../src/components/ui/PropertyContext.tsx). | Softened to “switch property scope”; no speed claim. |
| Open calendar slot creates a prefilled booking | No such behavior is asserted by the new marketing preview; the current homepage calendar is presentational. | Removed. |
| Revenue delta / “Realized Revenue” | No source was found for the previous hard-coded `+12.5% vs yesterday` value in the old showcase. | Removed. |
| Free forever / no booking commission | Signup exists, but the repository does not establish a pricing contract or commission policy. | Removed; requires owner confirmation. |
| CSV export | Booking CSV export is implemented in [BookingsList.tsx](../../src/features/bookings/BookingsList.tsx); report CSV export is implemented in [ReportsList.tsx](../../src/features/reports/ReportsList.tsx). | Kept with scope named plainly. |
| Sample data persists in browser | [demo.ts](../../src/lib/repository/demo.ts) reads/writes demo state in `localStorage`. | Kept for the sample workspace only. |
| Appwrite data is cloud-backed | [index.ts](../../src/lib/repository/index.ts) selects [appwrite.ts](../../src/lib/repository/appwrite.ts) when Appwrite is configured and the account is not demo. | Qualified: configuration-dependent; no cloud/security guarantee. |
| OTA sync, online payments, automated WhatsApp, housekeeping, AI | No corresponding working integrations/workflows were found in the connected homepage/product paths. | Listed as not connected/not implemented; not an exhaustive product roadmap. |

All displayed guest names, properties, dates, counts and money amounts in the marketing previews are illustrative sample data, separate from the live repository and labelled “Sample data”.
