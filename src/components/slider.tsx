export default function Slider(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-screen flex-row justify-center gap-4 overflow-x-scroll align-middle">
      {props.children}
    </div>
  )
}
