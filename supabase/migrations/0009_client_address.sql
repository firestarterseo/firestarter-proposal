-- Needed for the service agreement (components/proposal/ServiceAgreementSection.js),
-- which names the client's address in its opening paragraph. Optional —
-- historically this was often left blank even in signed agreements.

alter table proposals add column client_address text default '';
