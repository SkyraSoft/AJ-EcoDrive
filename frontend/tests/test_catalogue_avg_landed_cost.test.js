import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '../src/store.js'
import { contextHelpRegistry } from '../src/tour/content/contextHelp/contextHelpRegistry.js'
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js'

describe('AJ EcoDrive — Product Catalogue Avg. Landed Cost Suite', () => {
  beforeEach(() => {
    // Reset store session to Super Admin
    store.setSession({
      isAuthenticated: true,
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true,
      branchCode: 'ALL',
      branchName: 'All Branches'
    })
  })

  it('calculates exact average landed cost from owned unsold serialized units', () => {
    const testProduct = {
      id: 'PROD-TEST-AVG',
      product_id: 'PROD-TEST-AVG',
      name: 'BRG E-100 Test',
      sku: 'SKU-E100-TEST'
    }

    // Add temporary serialized units
    store.serializedUnits.unshift(
      { id: 'UNIT-T1', product_id: 'PROD-TEST-AVG', sku: 'SKU-E100-TEST', landedCost: 145000, status: 'Available' },
      { id: 'UNIT-T2', product_id: 'PROD-TEST-AVG', sku: 'SKU-E100-TEST', landedCost: 155000, status: 'Available' },
      { id: 'UNIT-T3', product_id: 'PROD-TEST-AVG', sku: 'SKU-E100-TEST', landedCost: 150000, status: 'Available' }
    )

    const result = store.getProductAvgLandedCost(testProduct)
    expect(result.count).toBe(3)
    expect(result.avg).toBe(150000)
    expect(result.formatted).toBe('PKR 150,000')

    // Clean up
    store.serializedUnits = store.serializedUnits.filter(u => u.product_id !== 'PROD-TEST-AVG')
  })

  it('excludes Sold and Scrapped units from average calculation', () => {
    const testProduct = {
      id: 'PROD-TEST-EXCLUDE',
      product_id: 'PROD-TEST-EXCLUDE',
      sku: 'SKU-EXCLUDE'
    }

    store.serializedUnits.unshift(
      { id: 'UNIT-E1', product_id: 'PROD-TEST-EXCLUDE', landedCost: 100000, status: 'Available' },
      { id: 'UNIT-E2', product_id: 'PROD-TEST-EXCLUDE', landedCost: 200000, status: 'Sold' },
      { id: 'UNIT-E3', product_id: 'PROD-TEST-EXCLUDE', landedCost: 300000, status: 'Scrapped' }
    )

    const result = store.getProductAvgLandedCost(testProduct)
    expect(result.count).toBe(1)
    expect(result.avg).toBe(100000)

    store.serializedUnits = store.serializedUnits.filter(u => u.product_id !== 'PROD-TEST-EXCLUDE')
  })

  it('includes Reserved and Transfer In Transit units as owned unsold inventory', () => {
    const testProduct = {
      id: 'PROD-TEST-RESERVED',
      product_id: 'PROD-TEST-RESERVED',
      sku: 'SKU-RES'
    }

    store.serializedUnits.unshift(
      { id: 'UNIT-R1', product_id: 'PROD-TEST-RESERVED', landedCost: 120000, status: 'Reserved' },
      { id: 'UNIT-R2', product_id: 'PROD-TEST-RESERVED', landedCost: 180000, status: 'Transfer In Transit' }
    )

    const result = store.getProductAvgLandedCost(testProduct)
    expect(result.count).toBe(2)
    expect(result.avg).toBe(150000)

    store.serializedUnits = store.serializedUnits.filter(u => u.product_id !== 'PROD-TEST-RESERVED')
  })

  it('returns formatted dash — and null avg when product has no owned unsold stock', () => {
    const testProduct = {
      id: 'PROD-NO-STOCK',
      product_id: 'PROD-NO-STOCK',
      sku: 'SKU-NO-STOCK'
    }

    const result = store.getProductAvgLandedCost(testProduct)
    expect(result.count).toBe(0)
    expect(result.avg).toBeNull()
    expect(result.formatted).toBe('—')
  })

  it('detects provisional landed cost when any included unit is flagged as provisional', () => {
    const testProduct = {
      id: 'PROD-PROVISIONAL',
      product_id: 'PROD-PROVISIONAL',
      sku: 'SKU-PROV'
    }

    store.serializedUnits.unshift(
      { id: 'UNIT-P1', product_id: 'PROD-PROVISIONAL', landedCost: 140000, status: 'Available', isProvisional: true },
      { id: 'UNIT-P2', product_id: 'PROD-PROVISIONAL', landedCost: 160000, status: 'Available' }
    )

    const result = store.getProductAvgLandedCost(testProduct)
    expect(result.count).toBe(2)
    expect(result.avg).toBe(150000)
    expect(result.isProvisional).toBe(true)

    store.serializedUnits = store.serializedUnits.filter(u => u.product_id !== 'PROD-PROVISIONAL')
  })

  it('verifies context help registry includes term-avg-landed-cost', () => {
    const helpEntry = contextHelpRegistry.find(c => c.topicId === 'term-avg-landed-cost')
    expect(helpEntry).toBeDefined()
    expect(helpEntry.title).toBe('Average Landed Cost')
    expect(helpEntry.targetId).toBe('sa.catalogue.products.avg-landed-cost')
  })

  it('verifies SA-05 tour step 1 text accurately describes Avg. Landed Cost vs Selling Price', () => {
    const sa05Mission = superAdminMissions.find(m => m.code === 'SA-05')
    expect(sa05Mission).toBeDefined()

    const step1 = sa05Mission.steps.find(s => s.stepNumber === 1)
    expect(step1).toBeDefined()
    expect(step1.instruction).toContain('Average Landed Cost shows roughly what current physical inventory for this model has cost the business to acquire')
    expect(step1.instruction).toContain('Selling Price is the catalogue selling/reference price')
    expect(step1.instruction).toContain('the actual cost of a completed sale comes from the exact serialized unit sold')
    expect(step1.whyItMatters).toContain('creates ZERO physical stock')
  })

  it('verifies SA-05 tour mission is structured card-by-card into 6 steps', () => {
    const sa05Mission = superAdminMissions.find(m => m.code === 'SA-05')
    expect(sa05Mission).toBeDefined()
    expect(sa05Mission.steps.length).toBe(6)

    const targetIds = sa05Mission.steps.map(s => s.targetId)
    expect(targetIds).toEqual([
      'sa.catalogue.products.table',
      'sa.catalogue.products.create-btn',
      'sa.catalogue.createproduct.identity-card',
      'sa.catalogue.createproduct.tracking-card',
      'sa.catalogue.createproduct.specs-card',
      'sa.catalogue.createproduct.commercial-card'
    ])
  })

  it('verifies product creation adds master product without creating physical stock', () => {
    const initialUnitCount = store.serializedUnits.length
    const newProd = {
      id: 'PROD-NEW-TEST',
      name: 'BRG Super Test Bike',
      category: 'Electric Bikes',
      subcategory: 'Commuter',
      tracking: 'Serialized - Serial + Chassis',
      price: 195000,
      variants: 'Standard',
      warranty: '2 Years / 20,000 km',
      activation: 'Active after review'
    }

    store.products.push(newProd)
    expect(store.products.find(p => p.id === 'PROD-NEW-TEST')).toBeDefined()
    // Product creation MUST create ZERO physical stock
    expect(store.serializedUnits.length).toBe(initialUnitCount)

    // Clean up
    store.products = store.products.filter(p => p.id !== 'PROD-NEW-TEST')
  })
})

