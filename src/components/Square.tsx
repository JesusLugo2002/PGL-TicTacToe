type Props = {
    value: String
    onSquareClick: () => void
}

export default function Square({ value, onSquareClick }: Props) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}