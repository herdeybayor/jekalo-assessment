function InputGroup(props) {
  return (
    <div className="flex flex-col justify-end">
      <label className="text-blue-800 font-bold text-xl" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        className="outline-none border-2 rounded-lg px-4 py-3 focus:ring-2"
        type="text"
        placeholder={props.label}
        id={props.name}
        name={props.name}
        onChange={props.change}
        value={props.value}
        required
      />
    </div>
  );
}

export default InputGroup;
