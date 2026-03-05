import { createAccessControl } from "better-auth/plugins";
import {
  defaultStatements,
  adminAc,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statements = {
  ...defaultStatements,
  users: ["create", "read", "update", "delete"],
  notes: ["create", "read", "update", "delete"],
  customers: ["create", "read", "update", "delete"],
  leads: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statements);

const admin = ac.newRole({
  ...adminAc.statements,
  users: ["create", "read", "delete"],
  customers: ["create", "read", "update", "delete"],
});

const owner = ac.newRole({
  ...ownerAc.statements,
  leads: ["create", "read", "update", "delete"],
  users: ["create", "read", "delete"],
  notes: ["create", "read", "update", "delete"],
  customers: ["create", "read", "update", "delete"],
});

const member = ac.newRole({
  ...memberAc.statements,
  leads: ["create", "read", "update"],
  users: ["read", "update"],
  customers: ["create", "read", "update"],
  notes: ["create", "read", "update", "delete"],
});

export { ac, admin, owner, member };
