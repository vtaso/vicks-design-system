// url=https://www.figma.com/design/wLfbdrcBXEueHVCWWxLlYG/Vicks-Library-Tokens-and-Variables?node-id=16-411
// component=Button

import figma from "figma"

const label = figma.selectedInstance.getString("Label")
const variant = figma.selectedInstance.getEnum("Type", {
  Default: "primary",
  Outline: "outline",
  Transparent: "transparent",
  Destructive: "destructive",
})
const disabled = figma.selectedInstance.getEnum("Status", {
  disabled: true,
})
const iconLeft = figma.selectedInstance.getBoolean("Icon left", {
  true: figma.selectedInstance
    .getInstanceSwap("Icon Left swap")
    ?.executeTemplate().example,
  false: undefined,
})
const iconRight = figma.selectedInstance.getBoolean("Icon right", {
  true: figma.selectedInstance
    .getInstanceSwap("Icon  Right Swap")
    ?.executeTemplate().example,
  false: undefined,
})

export default {
  id: "Button",
  imports: ["import { Button } from './Button'"],
  example: figma.code`<Button${figma.helpers.react.renderProp(
    "label",
    label,
  )}${figma.helpers.react.renderProp(
    "variant",
    variant,
  )}${figma.helpers.react.renderProp(
    "disabled",
    disabled,
  )}${figma.helpers.react.renderProp(
    "iconLeft",
    iconLeft,
  )}${figma.helpers.react.renderProp("iconRight", iconRight)}/>`,
  metadata: { nestable: true },
}
