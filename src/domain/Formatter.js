/* @flow */
import {
  buildGridContainerStyle,
  buildPanes,
  type GridState
} from "./GridState";
import cssbeautify from "cssbeautify";
import paramCase from "param-case";

export function toCSS(state: GridState): string {
  const containerStyle = buildGridContainerStyle(state);
  const containerParams = Object.keys(containerStyle).map(key => {
    const value = containerStyle[key];
    return `${paramCase(key)}: ${value};`;
  });
  const panes = buildPanes(state);

  const areas = panes.map(pane => pane.gridArea);

  return (
    "// CSS\n" +
    cssbeautify(`
.container {
  ${containerParams.join("\n")}
}
${areas
  .map(
    area => `
  .area-${area} { grid-area: ${area}; }
`
  )
  .join("\n")}`) +
    `
// HTML
<div class="container">
${areas.map(area => `  <div class="area-${area}"></div>`).join("\n")}
</div>
`
  );
}

export function toStyledComponents(state: GridState): string {
  const containerStyle = buildGridContainerStyle(state);
  const containerParams = Object.keys(containerStyle).map(key => {
    const value = containerStyle[key];
    return `${paramCase(key)}: ${value};`;
  });
  const panes = buildPanes(state);

  const areas = panes.map(pane => pane.gridArea);

  return `// Generated by CSS Grid Editor
import styled from 'styled-components'

export default styled.div\`
${cssbeautify(containerParams.join("\n"))}
\`
${areas
  .map(
    area => `
export const ${area} = styled.div\`grid-area: ${area}\`
`
  )
  .join("\n")}

// How to use
import Layout, * as Area from './layouts/Layout'

export default () => {
  <Layout>
${areas.map(area => `    <Area.${area}/>`).join("\n")}
  </Layout>
}
`;
}
