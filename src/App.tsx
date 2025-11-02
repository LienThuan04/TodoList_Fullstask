import { Toaster, toast } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router"
import HomePage from "pages/HomePage"
import NotFound from "pages/NotFound"

function App() {

  return (
    <>
    <Toaster position="bottom-right" richColors closeButton />
    <button onClick={() => {
        toast("notification", { description: 'This is a success toast!', type : 'success'})
    } }>
        Show Success Toast
      </button>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="Login" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      
     
    </>
  )
}

export default App
