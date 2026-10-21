# Components overview

Pick the component by job, then read its file.

| Component | Also called | Use it to | File |
| --- | --- | --- | --- |
| Button | CTA, action | Trigger an action | [button.md](button.md) |
| Button Icon | Icon button | Trigger a compact, icon-only action | [button-icon.md](button-icon.md) |
| Field | Text field, input box | Enter text with label, icons, validation | [field.md](field.md) |
| Input | Text input | Enter text with hint copy | [input.md](input.md) |
| Label | Form label | Name a field | [label.md](label.md) |
| Link | Hyperlink | Navigate | [link.md](link.md) |
| Breadcrumb | Path | Show location in a hierarchy | [breadcrumb.md](breadcrumb.md) |
| Menu | Action menu, overflow | Show a short list of actions | [menu.md](menu.md) |
| Dropdown | Select | Choose one of 5+ options | [dropdown.md](dropdown.md) |
| List item | Row | Show items in a list | [list.md](list.md) |

## Decision tree

- Does it change data or start a process? → **Button** (icon-only → **Button Icon**).
- Does it take the user somewhere else? → **Link**.
- Is it free text? → **Field** with a **Label**.
- Is it one choice from a list? 2–4 options → show them; 5+ → **Dropdown**.
- Is it a list of actions from one trigger? → **Menu**.

## Shared rules

- Every interactive component has default, hover, focus and disabled states, and the focus ring is always `color.border.focus`.
- Component property names in Figma match code props exactly. Code Connect breaks when they drift.
- Target: Status values are lowercase and identical everywhere (`default`, `hover`, `focus`, `disabled`). Today Field uses `Default` and Link/Breadcrumb use `disable` — see [../audit.md](../audit.md).
