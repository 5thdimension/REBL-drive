import React, {useState, useCallback} from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isEmpty, isUndefined, drop, intersection, union, difference } from 'lodash'
import filesize from 'filesize'
import { useFiles, useFavorites, useFavorite, useSelection, useShared, useTrash, groupFiles,
         useDriveItems, useDriveItem, useCurrent, useFileMeta, useDirectoryMeta, useDriveBranch } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"
import config from "./config"
import FilesTable from './Table'
import ActionBar from './ActionBar'
import { useExportAction } from './action'
import StartArea from './StartArea'

const kind = config.kind

export function Favorites ({drive, navigate}) {
  const pane = "favorites"
  const [favorites, setFavorite, getFavorite] = useFavorites(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, difference(selection, trashed))
  const items = useDriveItems(drive, difference(favorites, trashed))
  const chosenItems = intersection(items,selectedItems)
  const exportAction = useExportAction(chosenItems)
  console.log("Favorities:", favorites, items, chosenItems)
  return (
    <>
      <div className="pane-heading d-flex justify-content-between">
        <Breadcrumb title="Favorites" trail={[]} onClick={navigate}/>
        <ActionBar className="mr-4" drive={drive} pane={pane}
           items={chosenItems} exportAction={exportAction}/>
      </div>
      {!isEmpty(items) &&
       <FilesTable drive={drive} items={items} pane="favorites" navigate={navigate}/>}
    </>)
}

function useDrivePath(drive, location) {
  const trail = location && location.pathname && location.pathname.split('/')
  const path = trail && drop(trail, 2).map(decodeURIComponent)
  return(path || [])
}

export default function Drive ({drive, navigate}) {
  const title = drive.title || "Drive"
  const pane = null
  const items = useDriveBranch(drive)
  const [current, setCurrent] = useCurrent(drive)
  const [trashed, setTrashed, isTrashed] = useTrash(drive)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const active = difference(items.map((item) => item.pathname), trashed)
  const activeItems = useDriveItems(drive, active)
  const [selection, select, isSelected] = useSelection(drive, pane)
  const selectedItems = useDriveItems(drive, difference(selection, trashed))
  const chosenItems = intersection(items,selectedItems)
  const exportAction = useExportAction(chosenItems)
  // console.log("DRIVE->", activeItems, selection, intersection(activeItems, selection))
  return(
  <div className="flex-grow-1 d-flex flex-column">
     <div className="pane-heading d-flex justify-content-between">
       <Breadcrumb title={title} trail={current} onClick={navigate}/>
       <ActionBar className="mr-4" drive={drive} pane={pane}
          items={chosenItems} exportAction={exportAction}/>
     </div>
     <div className="flex-grow-1 d-flex">
       {isEmpty(activeItems) &&
        <StartArea drive={drive}/>}
       {!isEmpty(activeItems) &&
        <FilesTable drive={drive} items={activeItems} navigate={navigate} isFavorite={isFavorite}/>}
     </div>
  </div>)
}
