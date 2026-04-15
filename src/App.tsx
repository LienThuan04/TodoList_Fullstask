import { Toaster } from "sonner"
import RoutesApp from "@routes/RoutesApp"


function App() {

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton/>
      <RoutesApp />
    </>
  )
}

export default App
