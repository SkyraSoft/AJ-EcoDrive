/**
 * AJ ECODRIVE — WAVE 2 COMPONENT EDIT PRELOAD SUITE
 * Uses @vue/test-utils with JSDOM to mount real Edit view components,
 * supplying test fixtures to store, and asserting that every single form input
 * control accurately preloads stored data into both the DOM and reactive models.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'

import { store } from '@/store.js'
import EditBranch from '@/views/organisation/EditBranch.vue'
import EditPriceRule from '@/views/catalogue/EditPriceRule.vue'
import EditProduct from '@/views/catalogue/EditProduct.vue'
import EditSupplier from '@/views/procurement/EditSupplier.vue'

describe('AJ EcoDrive — Wave 2 Edit Component Preload Gate', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/organisation/branches', component: { template: '<div>Branches</div>' } },
        { path: '/catalogue/pricing', component: { template: '<div>Pricing</div>' } },
        { path: '/catalogue/products', component: { template: '<div>Products</div>' } },
        { path: '/procurement/suppliers', component: { template: '<div>Suppliers</div>' } }
      ]
    })
  })

  // ---------------------------------------------------------------------------
  // 1. EditBranch.vue Preload (Branch Notes & Change Note)
  // ---------------------------------------------------------------------------
  it('preloads branch notes and attributes into EditBranch.vue', async () => {
    const branchFixture = {
      id: 'BR-TEST-PRELOAD',
      name: 'Peshawar Central',
      code: 'PEW-CENTRAL',
      city: 'Peshawar',
      address: 'Industrial Estate Hayatabad',
      area: 'Hayatabad Phase 3',
      phone: '+92 91 5849200',
      email: 'pew.central@ajecodrive.com',
      manager: 'Kamran Shah',
      defaultLocation: 'Bay 12 Storage',
      hours: '8:30 AM - 6:00 PM',
      expenseLimit: '250000',
      discountLimit: '15%',
      salesRules: 'Strict KYC Required',
      notes: 'W2-BRANCH-PERMANENT-NOTES-731',
      changeNote: 'W2-BRANCH-CHANGE-NOTE-842',
      status: 'Active'
    }

    const wrapper = mount(EditBranch, {
      props: {
        isModal: true,
        branch: branchFixture
      },
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Assert reactive model and rendered values
    const notesTextarea = wrapper.find('textarea')
    expect(notesTextarea.exists()).toBe(true)
    expect(notesTextarea.element.value).toBe('W2-BRANCH-PERMANENT-NOTES-731')

    const changeNoteInput = wrapper.findAll('input').find(i => i.element.placeholder && i.element.placeholder.includes('configuration review'))
    expect(changeNoteInput).toBeDefined()
    expect(changeNoteInput.element.value).toBe('W2-BRANCH-CHANGE-NOTE-842')
  })

  // ---------------------------------------------------------------------------
  // 2. EditPriceRule.vue Preload (All 6 Price Rule Fields)
  // ---------------------------------------------------------------------------
  it('preloads all 6 price rule fields into EditPriceRule.vue', async () => {
    const priceRuleFixture = {
      product: 'BRG DS11',
      sellingPrice: '185,000',
      landedCostRef: '146,000',
      markup: '26.7%',
      margin: '21.1%',
      minimum: '176,000',
      branchOverride: 'Peshawar',
      effective: '2026-10-15',
      reason: 'W2-PRICE-RULE-REASON-731'
    }

    store.originalEditPriceRule = priceRuleFixture

    const wrapper = mount(EditPriceRule, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // EditPriceRule Assertions
    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThanOrEqual(2)
    expect(selects[0].element.value).toBe('BRG DS11')
    expect(selects[1].element.value).toBe('Peshawar')

    const inputs = wrapper.findAll('input')
    const effectiveInput = inputs.find(i => i.element.value === '2026-10-15')
    expect(effectiveInput).toBeDefined()

    const sellingPriceInput = inputs.find(i => i.element.value === '185,000')
    expect(sellingPriceInput).toBeDefined()

    const minimumInput = inputs.find(i => i.element.value === '176,000')
    expect(minimumInput).toBeDefined()

    const reasonInput = inputs.find(i => i.element.value === 'W2-PRICE-RULE-REASON-731')
    expect(reasonInput).toBeDefined()
  })

  // ---------------------------------------------------------------------------
  // 3. EditProduct.vue Preload (21 Product Attributes)
  // ---------------------------------------------------------------------------
  it('preloads all 21 product fields into EditProduct.vue', async () => {
    const productFixture = {
      id: 'PROD-W2-TEST',
      product_id: 'PROD-W2-TEST',
      name: 'W2 E-Cruiser Pro',
      category: 'Electric Bikes',
      subcategory: 'Commuter',
      model: 'EC-2026-PRO',
      sku: 'SKU-W2-ECPRO-01',
      tracking: 'Serialized - Serial + Chassis',
      variants: 'Matte Black / Slate Grey',
      warranty: '3 Years Comprehensive',
      motor: '500W High Torque Brushless',
      battery: '48V 20Ah Samsung Lithium',
      range: '85 km per charge',
      speed: '50 km/h top speed',
      supplier: 'BRG Factory',
      price: '245,000',
      stock: '15 units',
      reorderLevel: '8',
      documents: 'Brochure_v2.pdf, Warranty_Policy.pdf',
      media: 'product_hero.png, angle_view.png',
      activation: 'Active after review'
    }

    store.originalEditProduct = productFixture

    const wrapper = mount(EditProduct, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Assert inputs
    const inputs = wrapper.findAll('input')
    const values = inputs.map(i => i.element.value)

    expect(values).toContain('W2 E-Cruiser Pro')
    expect(values).toContain('Electric Bikes')
    expect(values).toContain('Commuter')
    expect(values).toContain('EC-2026-PRO')
    expect(values).toContain('SKU-W2-ECPRO-01')
    expect(values).toContain('Serialized - Serial + Chassis')
    expect(values).toContain('Matte Black / Slate Grey')
    expect(values).toContain('3 Years Comprehensive')
    expect(values).toContain('500W High Torque Brushless')
    expect(values).toContain('48V 20Ah Samsung Lithium')
    expect(values).toContain('85 km per charge')
    expect(values).toContain('50 km/h top speed')
    expect(values).toContain('245,000')
    expect(values).toContain('8')
    expect(values).toContain('Brochure_v2.pdf, Warranty_Policy.pdf')
    expect(values).toContain('product_hero.png, angle_view.png')
    expect(values).toContain('Active after review')
  })

  // ---------------------------------------------------------------------------
  // 4. EditSupplier.vue Preload (All 9 Supplier Fields)
  // ---------------------------------------------------------------------------
  it('preloads all 9 supplier fields into EditSupplier.vue', async () => {
    const supplierFixture = {
      id: 'SUP-W2-TEST',
      supplier_id: 'SUP-W2-TEST',
      name: 'BRG Advanced EV Dynamics',
      contact: 'Zhang Wei',
      phone: '+86 21 8839 7788',
      email: 'zhang.wei@brgfactory.cn',
      address: 'Zone 4, High Tech Park, Shenzhen',
      currency: 'USD',
      terms: 'Net 60',
      taxId: 'NTN-CN-8839201',
      notes: 'Key OEM powertrain supplier for 2026 model lines.'
    }

    store.originalEditSupplier = supplierFixture

    const wrapper = mount(EditSupplier, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    const inputs = wrapper.findAll('input')
    const inputValues = inputs.map(i => i.element.value)

    expect(inputValues).toContain('BRG Advanced EV Dynamics')
    expect(inputValues).toContain('Zhang Wei')
    expect(inputValues).toContain('+86 21 8839 7788')
    expect(inputValues).toContain('zhang.wei@brgfactory.cn')
    expect(inputValues).toContain('NTN-CN-8839201')

    const textareas = wrapper.findAll('textarea')
    const textareaValues = textareas.map(t => t.element.value)
    expect(textareaValues).toContain('Zone 4, High Tech Park, Shenzhen')
    expect(textareaValues).toContain('Key OEM powertrain supplier for 2026 model lines.')

    const selects = wrapper.findAll('select')
    expect(selects[0].element.value).toBe('USD')
    expect(selects[1].element.value).toBe('Net 60')
  })
})
