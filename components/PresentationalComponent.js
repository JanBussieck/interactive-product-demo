import React, {useRef, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import classes from './info.module.css'
import classNames from 'classnames';
import iconClasses from './icon.module.css'
const styles = {
  position: 'relative',
};

const iconStyles = {
  width: '24px',
  color: 'white'
};

const containerStyles = {
  position: 'absolute',
  display: 'flex',
  padding: '0.8rem',
  borderRadius: '2rem',
  height: '50px',
  width: '50px',
  border: '2px solid white',
  cursor: 'pointer',
}

const Icon = ({isSelected, left, top, onClick}) =>
  <div className={classNames(iconClasses.iconContainer, {
    [iconClasses.iconContainerSelected]: isSelected
  })} style={{...containerStyles, left, top}} onClick={onClick}>
    <FontAwesomeIcon className={classNames(iconClasses.icon, {
      [iconClasses.iconSelected]: isSelected
    })} icon={faPlus} style={iconStyles} />
  </div>

export default ({icons, imageSrc}) => {
  const imageRef = useRef();
  const [selected, setSelected] = useState();
  const selectedIcon = icons[selected];
  const imageWidth = imageRef.current && imageRef.current.naturalWidth;
  const imageHeight = imageRef.current && imageRef.current.naturalHeight;
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
    <div className={classes.infoContainer}>
      <div>
        <div className={classes.infoBox}>
          {selectedIcon ? (
            <>
              <div className={classes.infoImageContainer}>
                <div className={classes.infoRadial} />
                <img
                  style={{objectPosition: `${imageX}px ${imageY}px`}}
                  src={imageSrc}
                  className={classes.infoImage}
                />
              </div>
              <div className={classes.infoText} key={selected}>
                <h2>{selectedIcon.info.title}</h2>
                <p>
                  {selectedIcon.info.description}
                </p>
              </div>
            </>
          ) : (
            <div className={classes.infoText}>
              <h2>Produkt Highlights</h2>
              <p>
                Klicken Sie auf die Icons um Produktdetails einzublenden.
              </p>
            </div>
          )}
        </div>
      </div>
      <div style={{...styles, minWidth: imageWidth, minHeight: imageHeight}}>
        <img
          ref={imageRef}
          src={imageSrc}
          className={classes.toolImage}
        />
        {Object.keys(icons).map((key) => {
          const { left, top, title } = icons[key]
          const isSelected = selected === key
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
                setSelected(key);
              }}
            />
          )
        })}
      </div>
    </div>
  );
};
