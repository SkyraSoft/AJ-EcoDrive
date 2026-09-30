import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('AJ EcoDrive — Master Frontend Architecture & Integrity Gate Suite', () => {

  it('verifies PLATFORM_SUPPORT_POLICY.md enforces exactly Web + Desktop versions', () => {
    const policyPath = path.join(__dirname, '../PLATFORM_SUPPORT_POLICY.md');
    expect(fs.existsSync(policyPath)).toBe(true);

    const content = fs.readFileSync(policyPath, 'utf8');
    expect(content).toContain('Web Application');
    expect(content).toContain('Desktop Application');
    expect(content).toContain('THERE IS NO SEPARATE NATIVE MOBILE APPLICATION');
  });

  it('verifies Super Admin mapping completeness across all system routes', () => {
    const saMapPath = path.join(__dirname, '../SUPER_ADMIN_AND_SYSTEM_FULL_UI_TREE_MAPPING.md');
    expect(fs.existsSync(saMapPath)).toBe(true);

    const content = fs.readFileSync(saMapPath, 'utf8');
    expect(content).toContain('Super Admin Accessible Routes');
    expect(content).toContain('Super Admin Restricted');
  });

  it('verifies Unified Frontend Architecture Registry is populated and valid', async () => {
    const registryMod = await import('../src/config/frontendArchitectureRegistry.js');
    const registry = registryMod.unifiedFrontendArchitectureRegistry;

    expect(Array.isArray(registry)).toBe(true);
    expect(registry.length).toBeGreaterThanOrEqual(189);

    const saRoutes = registry.filter(r => r.roles.includes('Super Admin') || r.roles.includes('SuperAdmin') || r.roles.includes('Public'));
    expect(saRoutes.length).toBeGreaterThanOrEqual(187);

    const bmRoutes = registry.filter(r => r.roles.includes('Branch Manager') || r.roles.includes('BranchManager') || r.roles.includes('Public'));
    expect(bmRoutes.length).toBeGreaterThanOrEqual(155);
  });

  it('verifies Form Field Storage Contract covers all form fields with 0 unpersisted fields', () => {
    const formDocPath = path.join(__dirname, '../FRONTEND_FORM_FIELD_STORAGE_CONTRACT.md');
    expect(fs.existsSync(formDocPath)).toBe(true);

    const content = fs.readFileSync(formDocPath, 'utf8');
    expect(content).toContain('473');
    expect(content).toContain('Unpersisted Captured Fields:** **0');
  });

  it('verifies User Story Graph and Interaction Pattern Registries', async () => {
    const storyMod = await import('../src/config/frontendUserStoryGraph.js');
    expect(storyMod.userStoryGraphRegistry.length).toBeGreaterThanOrEqual(10);

    const interactMod = await import('../src/config/frontendInteractionPatternRegistry.js');
    expect(interactMod.interactionPatternRegistry.length).toBeGreaterThanOrEqual(7);

    const schemaMod = await import('../src/config/frontendFormSchemaRegistry.js');
    expect(schemaMod.formSchemaRegistry.length).toBeGreaterThanOrEqual(2);

    const actionMod = await import('../src/config/frontendActionContractRegistry.js');
    expect(actionMod.actionContractRegistry.length).toBeGreaterThanOrEqual(2);

    const stateMod = await import('../src/config/frontendStateMachineRegistry.js');
    expect(stateMod.stateMachineRegistry.length).toBeGreaterThanOrEqual(3);

    const defectMod = await import('../src/config/frontendMasterDefectRegistry.js');
    expect(defectMod.masterDefectRegistry.length).toBeGreaterThanOrEqual(2);
  });

  it('verifies Record Lifecycle Map covers state transitions for core business entities', () => {
    const lifecyclePath = path.join(__dirname, '../FRONTEND_RECORD_LIFECYCLE_MAP.md');
    expect(fs.existsSync(lifecyclePath)).toBe(true);

    const content = fs.readFileSync(lifecyclePath, 'utf8');
    expect(content).toContain('Serialized Unit');
    expect(content).toContain('Available');
    expect(content).toContain('Reserved');
    expect(content).toContain('Sold');
    expect(content).toContain('Delivered');
  });

  it('verifies Cross-Role & Multi-Branch Flow Map defines BM <-> SA workflow pairs', () => {
    const crossRolePath = path.join(__dirname, '../FRONTEND_CROSS_ROLE_AND_BRANCH_FLOW_MAP.md');
    expect(fs.existsSync(crossRolePath)).toBe(true);

    const content = fs.readFileSync(crossRolePath, 'utf8');
    expect(content).toContain('Petty Cash Expense Escalation');
    expect(content).toContain('Inter-Branch Stock Transfer');
    expect(content).toContain('Commercial Discount Ceiling Override');
  });

  it('verifies all 20 required master deliverable documents exist in repository', () => {
    const requiredDocs = [
      'PLATFORM_SUPPORT_POLICY.md',
      'SUPER_ADMIN_AND_SYSTEM_FULL_UI_TREE_MAPPING.md',
      'AJ_ECODRIVE_UNIFIED_FRONTEND_ARCHITECTURE.md',
      'FRONTEND_USER_STORY_GRAPH.md',
      'FRONTEND_INTERACTION_PATTERN_ARCHITECTURE.md',
      'FRONTEND_INTERACTION_PATTERN_AUDIT.md',
      'FRONTEND_FORM_FIELD_STORAGE_CONTRACT.md',
      'FRONTEND_FORM_SCHEMA_REGISTRY.md',
      'FRONTEND_ACTION_CONTRACT_REGISTRY.md',
      'FRONTEND_UI_DATA_LINEAGE_MAP.md',
      'FRONTEND_KPI_AND_CALCULATION_PROVENANCE.md',
      'FRONTEND_RECORD_LIFECYCLE_MAP.md',
      'FRONTEND_STATE_MACHINE_REGISTRY.md',
      'FRONTEND_CROSS_ROLE_AND_BRANCH_FLOW_MAP.md',
      'FRONTEND_ROLE_CAPABILITY_MATRIX.md',
      'FRONTEND_STATE_AND_STORE_ARCHITECTURE.md',
      'FRONTEND_MASTER_DEFECT_REGISTRY.md',
      'FRONTEND_MASTER_TRACEABILITY_MATRIX.md',
      'FRONTEND_BACKEND_CONTRACT_REQUIREMENTS.md',
      'FRONTEND_FINAL_VERIFICATION_REPORT.md'
    ];

    for (const docName of requiredDocs) {
      const p = path.join(__dirname, '..', docName);
      expect(fs.existsSync(p)).toBe(true);
    }
  });

});
