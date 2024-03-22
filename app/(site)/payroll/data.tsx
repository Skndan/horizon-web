
export const allowances = [
  { name: 'Basic', description: 'Basic', type: 'Fixed', basis: '50% of CTC', applicableForPF: true, taxable: true, status: 'Active' },
  { name: 'House Rent Allowance', description: 'House Rent Allowance', type: 'Fixed', basis: '50% of Basic', applicableForPF: false, taxable: true, status: 'Active' },
  { name: 'Conveyance Allowance', description: 'Conveyance Allowance', type: 'Fixed', basis: 'Flat Amount', applicableForPF: 'If PF Wage < 15k', taxable: false, status: 'Active' },
  { name: 'Fixed Allowance', description: 'Fixed Allowance', type: 'Fixed', basis: 'Flat Amount', applicableForPF: 'If PF Wage < 15k', taxable: true, status: 'Active' },
  { name: 'Bonus', description: 'Bonus', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: false, status: 'Active' },
  { name: 'Commission', description: 'Commission', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: true, status: 'Active' },
  { name: 'Children Education Allowance', description: 'Children Education Allowance', type: 'Fixed', basis: 'Flat Amount', applicableForPF: 'If PF Wage < 15k', taxable: true, status: 'Inactive' },
  { name: 'Transport Allowance', description: 'Transport Allowance', type: 'Fixed', basis: 'Flat amount of 1600', applicableForPF: 'If PF Wage < 15k', taxable: true, status: 'Inactive' },
  { name: 'Travelling Allowance', description: 'Travelling Allowance', type: 'Fixed', basis: 'Flat Amount', applicableForPF: 'If PF Wage < 15k', taxable: false, status: 'Inactive' },
  { name: 'Leave Encashment', description: 'Leave Encashment', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: false, status: 'Active' },
  { name: 'Gratuity', description: 'Gratuity', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: false, status: 'Active' },
  { name: 'Overtime Allowance', description: 'Overtime Allowance', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: true, status: 'Inactive' },
  { name: 'Notice Pay', description: 'Notice Pay', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: false, status: 'Active' },
  { name: 'Hold Salary', description: 'Hold Salary (Non Taxable)', type: 'Variable', basis: 'Flat Amount', applicableForPF: false, taxable: false, status: 'Active' }
];


export type AllowanceDetail = (typeof allowances)[number]
