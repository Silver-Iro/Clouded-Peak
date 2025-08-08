import { Sun } from "lucide-react"

const CustomNavBar = () => {
  return (
    <div className=" bg-stone-1000 font-[Bebas_Neue] italic ">
      <nav className="m-auto   flex justify-center">
        <div className=" max-w-256  flex grow justify-stretch ">
          {["Flow Planner", "Documentation", "Contact"].map((item) => (
            <div key={item} className={`flex w-full h-16 rounded-lg hover:bg-stone-700 hover:pb-1 ${item==="Flow Planner"? "border-b-2 pb-1 rounded-b-none border-yellow-700 bg-neutral-800":""}`}>
              <a href={`/${item.toLowerCase().replace(" ", "")}`}
                className={` w-full m-auto text-white text-center  text-2xl `}>
                {item}
              </a>
            </div>
          ))}
        </div>
        <div className="fixed right-4 top-4 mt-auto mb-auto h-10 w-10 border-stone-800 text-white border-2 rounded-full flex justify-center hover:text-black hover:bg-stone-200 hover:border-2 hover:rounded-full ">
          <button className=""><Sun size={20} onClick={()=>alert("Bruh.. \ngive your eyes some love.")}/></button>
        </div>
      </nav>
      <div className="ml-auto mr-auto max-w-256 h-1 rounded-2xl bg-stone-800"></div>
    </div>
  )
}
export default CustomNavBar