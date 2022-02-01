[![NPM version](https://img.shields.io/npm/v/jest-strip-styled-components.svg)](https://www.npmjs.com/package/jest-strip-styled-components)

# Jest Strip Styled Components
A serializer for [Jest](https://github.com/facebook/jest) snapshot testing to remove [Styled Components](https://github.com/styled-components/styled-components) classes from your code.

# Quick Start

## Installation

```sh
yarn add --dev jest-strip-styled-components
```

## Usage

The serializer can be imported separately from `jest-strip-styled-components`.
This makes it possible to use this package with [specific-snapshot](https://github.com/igor-dv/jest-specific-snapshot) and other libraries.

```js
import React from 'react'
import styled from 'styled-components'
import renderer from 'react-test-renderer'
import { stripSCSerializer } from "jest-strip-styled-components"
import { addSerializer } from "jest-specific-snapshot"

addSerializer(stripSCSerializer)

const Button = styled.button`
  color: red;
`

test('it works', () => {
  const tree = renderer.create(<Button />).toJSON()
  expect(tree).toMatchSpecificSnapshot("./Button.snap")
})
```
