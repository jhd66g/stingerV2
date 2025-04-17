import React from 'react'
import { Range } from 'react-range'
import './HomePage.css'

function RatingSlider({ minRating, maxRating, setMinRating, setMaxRating }) {
  const STEP = 0.1
  const MIN = 0
  const MAX = 10
  const values = [minRating, maxRating]

  const handleChange = newValues => {
    setMinRating(newValues[0])
    setMaxRating(newValues[1])
  }

  return (
    <div className="rating-filter">
      <div className="rating-slider">
        <Range
          step={STEP}
          min={MIN}
          max={MAX}
          values={values}
          onChange={handleChange}
          renderTrack={({ props, children }) => (
            <div {...props} className="rating-track">
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div {...props} className="rating-thumb">
              <div className="rating-thumb-value">
                {values[index].toFixed(1)}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default RatingSlider