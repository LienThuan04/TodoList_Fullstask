import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img src="404_NotFound.png" alt="404 Not Found" className="max-w-full w-96 mb-6" />
      <p className="text-xl font-semibold">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button variant="destructive" className="mt-4 mx-auto" size={"lg"} onClick={() => window.location.href = '/'}>
        👉 Go Back Home
      </Button>
    </div>
  )
};
export default NotFound