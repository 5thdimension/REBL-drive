import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faStar } from '@fortawesome/free-solid-svg-icons'
import filesize from 'filesize'
import { useFiles, useFavorites, useSelection, useShared, useTrash, groupFiles, useDriveItem, useFileMeta, useDirectoryMeta, useDriveItems } from "./library/drive"
import Breadcrumb from "./library/Breadcrumb"

function FileRow ({dir, name, item, favorite, selected, onClick}) {
  const meta = useFileMeta(item)
  const {url, modified, size, deleteFile} = meta
  console.log("FILEMETA:", item, meta)
  const date = modified && new Date(modified)
  const dateOptions = {month: "short", day: "numeric", year: "numeric"}
  return (
    <tr className={["FileRow", selected && "table-active"].join(" ")} onClick={onClick}>
      <td>
        <span className="item-icon"><FontAwesomeIcon icon={faFile}/></span>
        <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        {favorite && <FontAwesomeIcon icon={faStar}/>}
      </td>
      <td>{date && date.toLocaleDateString(undefined, dateOptions)}</td>
      <td>{size && filesize(size, {round: 1})}</td>
      <td><button onClick={deleteFile}>Delete</button></td>
    </tr> )
}

function DirRow ({item, name, onOpen, selected, onClick}) {
  const {modified, size} = useDirectoryMeta(item.pathname)
  return (
    <tr className={["DirRow", selected && "active"].join(" ")} onClick={onClick}>
       <td className="text-left">
         <span className="item-icon"><FontAwesomeIcon icon={faFolder}/></span>
         <a href="#" onClick={() => onOpen({item: item})}>{name}</a>
       </td>
       <td>{modified}</td>
       <td>{size}</td>
       <td></td>
    </tr>
  )
}

function ItemRow ({item, navigate, selected, onClick}) {
  const {path, name, isDirectory, pathname, favorite} = useDriveItem(item)
  console.log("ITEM:", item)
  return (
    isDirectory ?
    <DirRow key={name} item={item} name={name} selected={selected} onClick={onClick} onOpen={navigate}/> :
    <FileRow key={name} selected={selected} item={item} selected={selected} onClick={onClick} dir={path} name={name} favorite={favorite}/>
  )
}

export function FilesTable ({items, navigate, select, isSelected}) {
  return (
      <table className="table table-hover">
       <thead>
       <tr className="">
         <th></th>
         <th>Name</th>
         <th>Modified</th>
         <th>Size</th>
         <th>Actions</th>
       </tr>
       </thead>
       <tbody>
        {items && items.map((item) => {
          const selected = isSelected(item)
          return <ItemRow key={item.name} selected={selected} onClick={()=>select(item)} item={item} navigate={navigate}/>
          })}
       </tbody>
      </table>)
}

export default function Drive ({drive, navigate}) {
  const items = useDriveItems(drive)
  const [favorites, setFavorite, isFavorite] = useFavorites(drive)
  const [selection, select, isSelected] = useSelection(drive)
  return(
    <>
     <div className="d-flex justify-content-between">
       <Breadcrumb title="Drive" trail={drive.dir} onClick={navigate}/>
       <div>
         {(selection.size > 0) &&
           <button type="button" className="btn btn-light btn-rounded"
             onClick={() => {
               // FIX: Iterate over all values
               const item = selection.values().next().value
               console.log("CLICK", item)
               setFavorite(item, !isFavorite(item))
             }}>
             <FontAwesomeIcon icon={faStar}/>
           </button>}
       </div>
     </div>
     <FilesTable items={items} select={select} isSelected={isSelected} navigate={navigate}/>
    </>)
}

export function Favorites ({drive}) {
  const [items, toggleFavorite] = useFavorites(drive)
  return (
    <>
      <nav>Favorites</nav>
      <FilesTable items={items}/>
    </>)
}

export function Shared ({drive}) {
  const [items] = useShared(drive)
  return (
    <>
      <nav>Shared</nav>
      <FilesTable items={items}/>
    </>)
}

export function Trash ({drive}) {
  const [items] = useTrash(drive)
  return (
    <>
      <nav>Trash</nav>
      <FilesTable items={items}/>
    </>)
}
