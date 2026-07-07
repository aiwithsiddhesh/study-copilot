import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/pages/Dashboard'
import { PlanBuilder } from '@/pages/PlanBuilder'
import { PlanCalendar } from '@/pages/PlanCalendar'
import { Quiz } from '@/pages/Quiz'
import { Analytics } from '@/pages/Analytics'
import { Wellbeing } from '@/pages/Wellbeing'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="plan/build" element={<PlanBuilder />} />
        <Route path="plan/calendar" element={<PlanCalendar />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="wellbeing" element={<Wellbeing />} />
      </Route>
    </Routes>
  )
}

export default App
