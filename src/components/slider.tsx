export default function Slider(props: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row overflow-x-scroll gap-4 align-middle justify-center max-w-screen w-full">
      {props.children}
    </div>
  )
}