import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, BarChart2 } from "lucide-react";

const defaultExpenseTypes = ['Seeds','Fertilizer','Labor','Water','Machinery','Transport','Other'];
const defaultIncomeTypes = ['Crop Sale','Livestock','Subsidy','Other'];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Array<{id:number,type:string,amount:number}>>(() => {
    try { return JSON.parse(localStorage.getItem('sk_expenses_full') || '[]'); } catch { return []; }
  });
  const [incomes, setIncomes] = useState<Array<{id:number,type:string,amount:number}>>(() => {
    try { return JSON.parse(localStorage.getItem('sk_incomes_full') || '[]'); } catch { return []; }
  });

  const [expType, setExpType] = useState(defaultExpenseTypes[0]);
  const [expAmount, setExpAmount] = useState('');
  const [incType, setIncType] = useState(defaultIncomeTypes[0]);
  const [incAmount, setIncAmount] = useState('');

  const addExpense = () => {
    const amt = Number(expAmount);
    if (!expType || !amt || amt <= 0) return window.alert('Enter valid expense');
    const it = { id: Date.now(), type: expType, amount: amt };
    const next = [it, ...expenses];
    setExpenses(next);
    localStorage.setItem('sk_expenses_full', JSON.stringify(next));
    setExpAmount('');
  };

  const addIncome = () => {
    const amt = Number(incAmount);
    if (!incType || !amt || amt <= 0) return window.alert('Enter valid income');
    const it = { id: Date.now(), type: incType, amount: amt };
    const next = [it, ...incomes];
    setIncomes(next);
    localStorage.setItem('sk_incomes_full', JSON.stringify(next));
    setIncAmount('');
  };

  const totalExpenses = useMemo(() => expenses.reduce((a,b) => a + (b.amount||0), 0), [expenses]);
  const totalIncome = useMemo(() => incomes.reduce((a,b) => a + (b.amount||0), 0), [incomes]);
  const net = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Expense & Profit Tracker</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 flex flex-col">
              <div className="font-semibold mb-2 text-lg">Add Expenses</div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select className="flex-1 rounded-md border px-3 py-2" value={expType} onChange={(e)=>setExpType(e.target.value)}>
                      {defaultExpenseTypes.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input inputMode="numeric" placeholder="Amount (₹)" value={expAmount} onChange={(e)=>setExpAmount(e.target.value.replace(/[^0-9.]/g,''))} className="w-36 rounded-md border px-3 py-2" />
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Recent expenses</div>
                    <div className="space-y-2">
                      {expenses.map(e => (
                        <div key={e.id} className="flex items-center justify-between border rounded-md p-2">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-700"><ArrowDownRight className="h-4 w-4"/></div>
                            <div>
                              <div className="font-semibold text-sm">{e.type}</div>
                              <div className="text-xs text-muted-foreground">₹{e.amount}</div>
                            </div>
                          </div>
                          <div className="text-sm text-red-600 cursor-pointer" onClick={()=>{ setExpenses(s=>s.filter(i=>i.id!==e.id)); localStorage.setItem('sk_expenses_full', JSON.stringify(expenses.filter(i=>i.id!==e.id))); }}>Delete</div>
                        </div>
                      ))}
                      {expenses.length===0 && <div className="text-sm text-muted-foreground">No expenses yet</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => {
                  // export expenses CSV
                  const rows = [['Type','Amount']].concat(expenses.map(e=>[e.type,String(e.amount)]));
                  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'\"')}"`).join(',')).join('\n');
                  const blob = new Blob([csv], {type: 'text/csv'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'expenses.csv'; a.click();
                  URL.revokeObjectURL(url);
                }}>Export</Button>
                <Button onClick={addExpense}>Add Expense</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex flex-col">
              <div className="font-semibold mb-2 text-lg">Add Income</div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select className="flex-1 rounded-md border px-3 py-2" value={incType} onChange={(e)=>setIncType(e.target.value)}>
                      {defaultIncomeTypes.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input inputMode="numeric" placeholder="Amount (₹)" value={incAmount} onChange={(e)=>setIncAmount(e.target.value.replace(/[^0-9.]/g,''))} className="w-36 rounded-md border px-3 py-2" />
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Recent incomes</div>
                    <div className="space-y-2">
                      {incomes.map(e => (
                        <div key={e.id} className="flex items-center justify-between border rounded-md p-2">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-lime-100 text-lime-700"><ArrowUpRight className="h-4 w-4"/></div>
                            <div>
                              <div className="font-semibold text-sm">{e.type}</div>
                              <div className="text-xs text-muted-foreground">₹{e.amount}</div>
                            </div>
                          </div>
                          <div className="text-sm text-red-600 cursor-pointer" onClick={()=>{ setIncomes(s=>s.filter(i=>i.id!==e.id)); localStorage.setItem('sk_incomes_full', JSON.stringify(incomes.filter(i=>i.id!==e.id))); }}>Delete</div>
                        </div>
                      ))}
                      {incomes.length===0 && <div className="text-sm text-muted-foreground">No incomes yet</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => {
                  const rows = [['Type','Amount']].concat(incomes.map(e=>[e.type,String(e.amount)]));
                  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'\"')}"`).join(',')).join('\n');
                  const blob = new Blob([csv], {type: 'text/csv'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'incomes.csv'; a.click();
                  URL.revokeObjectURL(url);
                }}>Export</Button>
                <Button onClick={addIncome}>Add Income</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div>
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold">₹{totalExpenses}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Income</div>
                <div className="text-2xl font-bold">₹{totalIncome}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Net Profit</div>
                <div className={`text-2xl font-bold ${net>=0? 'text-emerald-700':'text-red-600'}`}>₹{net}</div>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <BarChart2 className="h-6 w-6 text-emerald-700" /> Trends
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
}
