 
import './App.css'
import Formiq from "formiq-sdk"
import { useFormiq } from 'formiq-sdk/react'
const formiq = new Formiq(
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjZhhWXcXvp87C+80lIk2bTk3d27IN2DCWF4/wvFh+qOxz53L5MWbl6t5l5spJhWl+apFL6GevLhhIOPSkr3bWyDocLancZAx0QWtbE09LwFRCO5zNuy3Ir1vFvFwzNfLmB5uEX/0E2414w7quYFUv1IFVP4IVm93hHKEF5p88Ibm7T9XQiGPgWj1KWQHSiZafIRBXHH4492+LIr719aHu/Lc4xwvj2Xma3gvXw3SIbPKLI0A7rFw/97csiYijtMWzy9+ppE0ziWLO49ep5j9RWNPKJMpTmNPikhKHek5BpyzvPvbrJlyNxZwubBVvzQ0bHP1qZLVhftb+P4TRhs/TQIDAQAB-----END PUBLIC KEY-----",
  "f9c1c5-portfolio-1760801505214"
);
function App() { 
  const { submit, loading, error } = useFormiq(formiq);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const result = await submit(data);
    console.log('Form submission result:', result);
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field1">
            Field 1
          </label>
          <input
            id="field1"
            name="field1"
            type="text"
            placeholder="Enter value for field 1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field2">
            Field 2
          </label>
          <input
            id="field2"
            name="field2"
            type="text"
            placeholder="Enter value for field 2"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
           
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500 text-xs italic mt-4">Error: {error.message}</p>}
      </form>
    </>
  )
}

export default App
