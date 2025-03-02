import Link from "next/link"

export default function Card(props:{
  title: string,
  description:string,
  url: string
  picUrl?: string
}) {
  return(
      <Link className="rounded-lg bg-primary-black-75 p-4 realtive overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-600" href={props.url}>
      <div className="relative p-4">
        <h3 className="text-lg font-bold mb-2">{props.title}</h3>
        <p className="text-gray-600 line-clamp-3">{props.description}</p>
      </div>
      </Link>
  )
}