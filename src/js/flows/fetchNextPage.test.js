/* @flow */

import {appendViewerRecords, spliceViewer} from "../state/viewer/actions"
import {fetchNextPage} from "./fetchNextPage"
import {setCurrentSpaceName} from "../state/actions"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"
import search from "../state/search"
import tab from "../state/tab"
import tabs from "../state/tabs"

const records = [
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "100"}
  ],
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "200"}
  ],
  [
    {name: "_td", type: "string", value: "1"},
    {name: "ts", type: "time", value: "300"}
  ]
]

let store, boom, tabId
beforeEach(() => {
  boom = new MockBoomClient().stub("search")
  store = initTestStore(boom)
  tabId = tabs.getActive(store.getState())
  store.dispatchAll([
    setCurrentSpaceName("default"),
    search.setSpanArgsFromDates([new Date(0), new Date(10 * 1000)]),
    tab.computeSpan(),
    appendViewerRecords(tabId, records)
  ])
  store.clearActions()
})

test("#fetchNextPage dispatches splice", () => {
  store.dispatch(fetchNextPage())

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{tabId, type: "VIEWER_SPLICE", index: 2}])
  )
})

test("#fetchNextPage adds 1ms to ts of last change", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(fetchNextPage())

  const lastChangeTs = records[1][1].value
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(+lastChangeTs * 1000 + 1)]
    })
  )
})

test("#fetchNextPage when there is only 1 event", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(spliceViewer(tabId, 1))
  store.dispatch(fetchNextPage())

  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(10 * 1000)]
    })
  )
})