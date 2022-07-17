interface OptionType {
  value: number
  text: string
}

export const penghasilanRange = [500000, 1000000, 2000000, 3000000]
export const luasTanahRange = [100, 300, 500, 800]

export const penghasilanRangeOption = () => {
  return penghasilanRange.reduce((acc, v, idx) => {
    if (idx === 0) {
      acc.push({ value: acc.length + 1, text: `< Rp${penghasilanRange[idx].toLocaleString('en')}` })
    }
    if (idx + 1 === penghasilanRange.length) {
      acc.push({ value: 5, text: `> Rp${penghasilanRange[penghasilanRange.length - 1].toLocaleString('en')}` })
      return acc
    }
    acc.push({
      value: acc.length + 1,
      text: `Rp${penghasilanRange[idx].toLocaleString('en')} - Rp${penghasilanRange[idx + 1].toLocaleString('en')}`,
    })
    return acc
  }, [] as OptionType[])
}

export const luasTanahRangeOption = () => {
  return luasTanahRange.reduce((acc, v, idx) => {
    if (idx === 0) {
      acc.push({ value: acc.length + 1, text: `< ${luasTanahRange[idx]}m2` })
    }
    if (idx + 1 === luasTanahRange.length) {
      acc.push({ value: 5, text: `> ${luasTanahRange[luasTanahRange.length - 1]}m2` })
      return acc
    }
    acc.push({
      value: acc.length + 1,
      text: `${luasTanahRange[idx]}m2 - ${luasTanahRange[idx + 1]}m2`,
    })
    return acc
  }, [] as OptionType[])
}
