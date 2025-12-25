import Link from "next/link"

export default function Card(props: {
  title: string
  description: string
  url: string
  picUrl?: string
}) {
  return (
    <Link
      className="bg-primary-black-75 realtive overflow-hidden rounded-lg p-4 shadow-lg transition-shadow duration-600 hover:shadow-xl"
      //@ts-expect-error Might 404
      href={props.url}>
      <div className="relative p-4">
        <h3 className="mb-2 text-lg font-bold">{props.title}</h3>
        <p className="line-clamp-3 text-gray-600">{props.description}</p>
      </div>
    </Link>
  )
}
