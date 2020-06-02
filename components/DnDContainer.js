import React from 'react'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants/ItemTypes'
import { v4 as uuidv4 } from 'uuid';
import Icon from './DnDIcon'
import update from 'immutability-helper'
import classes from './info.module.css'
const styles = {
  position: 'relative',
}
/*
 * backgroundImage: `url(${this.state.imageSrc})`, backgroundPositionX: `${selectedIcon.left}px`, backgroundPositionY: `${selectedIcon.top}px`, backgroundRepeat: 'repeat-y'
 *
                  <img
                    src={this.state.imageSrc}
                    style={{
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`,
                      clipPath: `circle(100px at ${selectedIcon.left}px ${selectedIcon.top}px)`,
                      left: `-${Math.abs(selectedIcon.left - 50) }px`
                    }}
                    className={classes.infoImage}
                  />
*/

class Container extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      imageSrc: "/images/tool.png",
      icons: {
        [uuidv4()]: {
          top: 20,
          left: 80,
          info: {},
        },
        [uuidv4()]: {
          top: 180,
          left: 20,
          info: {},
        },
      },
      mouseX: 0,
      mouseY: 0,
      open: null
    }
    this.onMouseMove = this.onMouseMove.bind(this);
    this.addIcon = this.addIcon.bind(this);
    this.openInfoBox = this.openInfoBox.bind(this);
    this.imageRef = React.createRef();
  }

  render() {
    const { connectDropTarget } = this.props
    const { icons, open } = this.state
    const selectedIcon = icons[open];
    const imageWidth = this.imageRef.current && this.imageRef.current.naturalWidth;
    const imageHeight = this.imageRef.current && this.imageRef.current.naturalHeight;
    const imageContainerWidth = 350;
    const imageContainerHeight = 200;
    const iconMargin = 25;
    let imageX, imageY;
    if (selectedIcon) {
      const deltaY = (imageContainerHeight / 2) - (selectedIcon.top)
      imageY = deltaY - iconMargin;

      const deltaX = (imageContainerWidth / 2) - (selectedIcon.left)
      imageX = deltaX - iconMargin;
    }
    console.log('imageX', imageX);
    console.log('imageY', imageY);
    console.log('selectedIcon', selectedIcon);
    return connectDropTarget(
        <div className={classes.infoContainer}>
        <div>
          <div className={classes.infoBox}>
            {selectedIcon ? (
              <>
                <div className={classes.infoImageContainer}>
                  <img
                    style={{objectPosition: `${imageX}px ${imageY}px`}}
                    src={this.state.imageSrc}
                    className={classes.infoImage}
                  />
                </div>
                <div className={classes.infoText}>
                  <input type="text" className={classes.input}  placeholder='Titel' />
                  <textarea className={classes.input} rows={3} placeholder='Beschreibung' />
                </div>
              </>
            ) : (
              <div className={classes.infoText}>
                <h2>Highlights hinzufügen</h2>
                <p>
                  Klicke auf das Bild und positioniere das Icon über der Bildregion, die gehighlightet werden soll.
                </p>
                <p>
                  Klicke anschließend auf das Icon um die Beschreibung hinzuzufügen.
                </p>
              </div>
            )}
          </div>
        </div>
        <div style={{...styles, minWidth: imageWidth, minHeight: imageHeight}} onMouseMove={this.onMouseMove} onClick={this.addIcon}>
          <img
            ref={this.imageRef}
            src={this.state.imageSrc}
            className={classes.toolImage}
          />
          {Object.keys(icons).map((key) => {
            const { left, top, title } = icons[key]
            const isSelected = this.state.open === key
            return (
              <Icon
                key={key}
                id={key}
                left={left}
                top={top}
                hideSourceOnDrag
                isSelected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  this.openInfoBox(key);
                }}
              />
            )
          })}
        </div>,
      </div>,
    )
  }

  onMouseMove(e) {
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY
    });
  }

  addIcon() {
    this.setState(
      update(this.state, {
        icons: {$merge: {
          [uuidv4()]: {
            left: (this.state.mouseX - 25), top: (this.state.mouseY - 25)
          },
        }},
      }),
    )
  }

  openInfoBox(id) {
    this.setState(
      update(this.state, {
        open: { $set: id }
      }),
    )
  }

  moveIcon(id, left, top) {
    this.setState(
      update(this.state, {
        icons: {
          [id]: {
            $merge: { left, top },
          },
        },
      }),
    )
  }
}

export default DropTarget(
  ItemTypes.ICON,
  {
    drop(props, monitor, component) {
      if (!component) {
        return
      }
      const item = monitor.getItem()
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      component.moveIcon(item.id, left, top)
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(Container)
