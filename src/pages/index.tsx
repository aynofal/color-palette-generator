import * as React from "react"
import {RGBColor, SketchPicker} from 'react-color'
import {useCallback, useEffect, useMemo, useState} from "react";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex({r, g, b}: RGBColor): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getColorWithAlpha(color: number, background: number, alpha: number): number {
  return color * alpha + background * (1 - alpha)
}

// markup
const IndexPage = () => {
  const [mainColor, setMainColor] = useState<RGBColor>({r: 0, g: 0, b: 0});
  const [bgColor, setBgColor] = useState<RGBColor>({r: 255, g: 255, b: 255});
  const [colorName, setColorName] = useState<string>('white');
  const formatColorWithAlpha: (alpha: number) => RGBColor = useCallback<(alpha: number) => RGBColor>((alpha) => ({
    r: Math.round(getColorWithAlpha(mainColor.r, bgColor.r, alpha)),
    g: Math.round(getColorWithAlpha(mainColor.g, bgColor.g, alpha)),
    b: Math.round(getColorWithAlpha(mainColor.b, bgColor.b, alpha)),
  }), [mainColor, bgColor])
  useEffect(() => {
    console.log(mainColor,bgColor)
  }, [mainColor, bgColor])
  return (
    <main style={pageStyles}>
      <title>Color generation tool</title>
      <div>
        <h2>Color Pickers</h2>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
            <h4>Main Color</h4>
            <SketchPicker onChange={(colorResult) => setMainColor(colorResult.rgb)} color={mainColor}/>
          </div>
          <div style={{width: '20px'}}/>
          <div>
            <h4>Background Color</h4>
            <SketchPicker onChange={(colorResult) => setBgColor(colorResult.rgb)} color={bgColor}/>
          </div>
        </div>
      </div>
      <div>
        <h2>Color Name</h2>
        <input type={'text'} value={colorName} onChange={(e) => {
          e.preventDefault();
          setColorName(e.target.value);
        }}/>
        <h2>Values</h2>
        <table style={{border: '1px solid', borderCollapse: 'collapse'}}>
          <tr style={{border: '1px solid', borderCollapse: 'collapse'}}>
            <th style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px'}}>
              Color
            </th>
            <th style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px'}}>
              Name
            </th>
            <th style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px'}}>
              Hex
            </th>
          </tr>
          {
            [...Array(100).keys()].reverse().map(value => {
              const alpha = useMemo(() => (value + 1)/100, [mainColor, bgColor]);
              const color = useMemo(() => rgbToHex(formatColorWithAlpha(alpha)), [mainColor, bgColor, alpha])
              return (<tr>
                <td style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px', backgroundColor: color}}/>
                <td style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px'}}>
                  {`${colorName}_${value+1}`}
                </td>
                <td style={{border: '1px solid', borderCollapse: 'collapse', padding: '5px'}}>
                  {color}
                </td>
              </tr>)
            })
          }
        </table>

      </div>
    </main>
  )
}

export default IndexPage
