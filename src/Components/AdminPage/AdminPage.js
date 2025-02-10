import Sidebar from "../Sidebar/Sidebar";
import  Dashboard from "../Dashboard/Dashboard";

export default  function AdminPage() {
    return (
        <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
            <Sidebar />
            <Dashboard /> 
        </main>
    )
}