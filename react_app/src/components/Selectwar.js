import '../index.css';
import React from "react"

export const Selectwar = React.memo((p) => {

  let arr = [...p.num[1]]
  arr.reverse()

  return (
    <>
      <div className='wars_all_container'>
        <div style={{ display: "inline-flex", flexDirection: "column", textAlign: "center" }}>
          <label style={{ color: "#d5d5d5", fontWeight: 'bold' }} >ALL </label>
          <input onChange={p.unclick} style={{ size: "50" }} type="checkbox" name="myCheckbox" />
        </div>
        <div className='select_war' style={{ display: "inline-flex", margin: "10px" }}>
          <label style={{ color: "#d5d5d5", fontWeight: 'bold' }} >WAR </label>
          <select multiple="multiple" className="option" onChange={p.change}>
            {p.num[0] == p.num[1][p.num[1].length - 1].warn ? null : <option selected="selected" className="options" >{p.num[0]}</option>}
            {(arr.map(e => e.winner == 'W' ? <option key={e.warn} className="list" style={{ color: "#44a5f7" }} >{e.warn}</option> : <option key={e.warn} className="list" style={{ color: "#3ba528" }} >{e.warn}</option>))}
          </select>
        </div>
      </div>
    </>
  );
})

