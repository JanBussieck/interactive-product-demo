import React from 'react'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants/ItemTypes'
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PresentationalComponent from './PresentationalComponent';
import Icon from './DnDIcon'
import update from 'immutability-helper'
import classes from './info.module.css'
const styles = {
  position: 'relative',
}

class DndContainerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.moveIcon = this.moveIcon.bind(this);
  }

  moveIcon(id, left, top) {
    this.props.moveIcon(id, left, top);
  }

  render() {
    const {onMouseMove, addIcon, openInfoBox, state, connectDropTarget} = this.props;
    const {icons} = state;
    const imageWidth = this.imageRef.current && this.imageRef.current.naturalWidth;
    const imageHeight = this.imageRef.current && this.imageRef.current.naturalHeight;

    return connectDropTarget(
      <div style={{...styles, minWidth: imageWidth, minHeight: imageHeight}} onMouseMove={onMouseMove} onClick={addIcon}>
        <img
          ref={this.imageRef}
          src={state.imageSrc}
          className={classes.toolImage}
        />
        {Object.keys(icons).map((key) => {
          const { left, top, title } = icons[key]
          const isSelected = state.open === key
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
                openInfoBox(key);
              }}
            />
          )
        })}
      </div>
    );
  }
}

const DndContainer = DropTarget(
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
)(DndContainerComponent)

class Container extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      imageSrc: "/images/tool.png",
      icons: {
        [uuidv4()]: {
          top: 310,
          left: 420,
          info: {
            title: "Optimaler Gleichlauf",
            description: "ETEL stellt mit Linear- und Torquemotoren sowie dem AccurET Controller sowohl hochgenaue Direktantriebe für Bewegungen im Nanometerbereich als auch drehmomentstarke Systeme für industrielle Anwendungen vor."
          },
        },
        [uuidv4()]: {
          top: 84,
          left: 112,
          info: {
            title: "Digitaler Messtaster",
            description: "Klassisch über Kabel oder drahtlos per Funk: HEIDENHAIN und NUMERIK JENA machen die Daten von Messtastern über die Auswerte-Elektronik GAGE-CHEK 2000 oder das Funkmodul SCM (Smart Communication Modul) in digitalen Netzwerken nutzbar."
          },
        },
      },
      mouseX: 0,
      mouseY: 0,
      open: null
    }
    this.onMouseMove = this.onMouseMove.bind(this);
    this.addIcon = this.addIcon.bind(this);
    this.openInfoBox = this.openInfoBox.bind(this);
    this.moveIcon = this.moveIcon.bind(this);
    this.imageRef = React.createRef();
  }

  render() {
    const { icons, open } = this.state
    console.log('icons', icons);
    const selectedIcon = icons[open];
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
    return (
      <>
      <h3>Die Input-Komponente:</h3>
      <hr style={{marginBottom: '4rem'}}/>
      <div className={classes.infoContainer}>
        <div>
          <div className={classes.infoBox}>
            {selectedIcon ? (
              <>
                <div className={classes.infoImageContainer}>
                  <div className={classes.infoRadial} />
                  <img
                    style={{objectPosition: `${imageX}px ${imageY}px`}}
                    src={this.state.imageSrc}
                    className={classes.infoImage}
                  />
                </div>
                <div className={classes.infoText} key={open}>
                  <input
                    type="text"
                    className={classes.input}
                    value={selectedIcon.info.title}
                    onChange={(ev) => {
                      this.handleInfoChange({id: open, info: {title: ev.target.value}});
                    }}
                    placeholder='Titel'
                  />
                  <textarea
                    className={classes.input}
                    rows={3}
                    value={selectedIcon.info.description}
                    onChange={(ev) => {
                      this.handleInfoChange({id: open, info: {description: ev.target.value}});
                    }}
                    placeholder='Beschreibung'
                  />
                  <div className={classes.btnGroup}>
                    <small className={classes.remove} onClick={() => this.removeIcon(open)}>Hightlight entfernen</small>
                    <button className={classes.btn} onClick={() => this.closeInfoBox(open)}>Speichern</button>
                  </div>
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
        <DndProvider backend={HTML5Backend}>
          <DndContainer
            onMouseMove={this.onMouseMove}
            addIcon={this.addIcon}
            openInfoBox={this.openInfoBox}
            moveIcon={this.moveIcon}
            state={this.state}
          />
        </DndProvider>
      </div>
      <h3>Die Anzeige-Komponente:</h3>
      <hr style={{marginBottom: '4rem'}}/>
      <PresentationalComponent icons={icons} imageSrc={this.state.imageSrc} />
      </>
    );
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
            left: (this.state.mouseX - 25), top: (this.state.mouseY - 25), info: {}
          },
        }},
      }),
    )
  }

  handleInfoChange({id, info}) {
    this.setState(
      update(this.state, {
        icons: {
          [id]: {
            info: { $merge: info }
          },
        },
      }),
    )
  }

  removeIcon(id) {
    this.setState(
      update(this.state, {
        icons: {$unset: [id]}
      }),
    )
  }

  closeInfoBox(id) {
    this.setState(
      update(this.state, {
        open: { $set: null }
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

export default Container;
