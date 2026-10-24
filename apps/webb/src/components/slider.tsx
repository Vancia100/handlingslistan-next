export default function Slider(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-screen flex-row flex-wrap justify-center gap-4 overflow-x-scroll align-middle md:flex-row md:flex-nowrap md:justify-start">
      {props.children}
    </div>
  )
}
