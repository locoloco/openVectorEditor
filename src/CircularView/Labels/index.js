import { connect } from "react-redux";
import polarToSpecialCartesian from "../utils/polarToSpecialCartesian";
import relaxLabelAngles from "./relaxLabelAngles";
import withHover from "../../helperComponents/withHover";
import pureNoFunc from "../../utils/pureNoFunc";
import "./style.css";
import React from "react";

function getHeightAndWidthOfLabel(text, fontWidth, fontHeight) {
  return {
    height: fontHeight,
    width: text.length * fontWidth
  };
}

function Labels({
  labels = {},
  outerRadius,
  editorName,
  circularViewWidthVsHeightRatio, //width of the circular view
  condenseOverflowingXLabels = true //set to true to make labels tha
  /*radius*/
}) {
  if (!Object.keys(labels).length) return null;
  outerRadius += 25;
  let radius = outerRadius;
  let outerPointRadius = outerRadius - 35;

  let fontWidth = 8;
  let fontHeight = fontWidth * 1.5;

  let labelPoints = Object.keys(labels)
    .map(function(key) {
      let label = labels[key];
      let { annotationCenterAngle, annotationCenterRadius } = label;
      return {
        ...label,
        ...getHeightAndWidthOfLabel(
          label.text || "Unlabeled",
          fontWidth,
          fontHeight
        ),
        //three points define the label:
        innerPoint: {
          ...polarToSpecialCartesian(
            annotationCenterRadius,
            annotationCenterAngle
          ),
          radius: annotationCenterRadius,
          angle: annotationCenterAngle
        },
        outerPoint: {
          ...polarToSpecialCartesian(outerPointRadius, annotationCenterAngle),
          radius: outerPointRadius,
          angle: annotationCenterAngle
        },
        ...polarToSpecialCartesian(radius, annotationCenterAngle),
        radius: radius + 10,
        angle: annotationCenterAngle
      };
    })
    .map(function(label) {
      label.labelAndSublabels = [label];
      return label;
    });
  let groupedLabels = relaxLabelAngles(
    labelPoints,
    fontHeight,
    outerRadius
  ).filter(l => !!l);
  // let groupedLabels = relaxLabelAngles(
  //   labelPoints,
  //   fontHeight,
  //   outerRadius
  // ).map(label => {
  //   //in order to memoize the relaxLabelAngles function, we don't pass the full label above because it has function handlers that cause the deep equal to fail
  //   const originalLabel = {
  //     ...labels[label.id],
  //     ...label
  //   };
  //   return {
  //     ...originalLabel,
  //     labelAndSublabels: [originalLabel].concat(originalLabel.labelAndSublabels)
  //   };
  // });
  window.isLabelGroupOpen = false;
  return {
    component: (
      <g key={"veLabels"} className="veLabels ve-monospace-font">
        {
          <DrawGroupedLabels
            {...{
              editorName,
              groupedLabels,
              circularViewWidthVsHeightRatio,
              fontWidth,
              fontHeight,
              condenseOverflowingXLabels,
              outerRadius
            }}
          />
        }
      </g>
    ),
    //we use the <use> tag to position the hovered label group at the top of the stack
    //point events: none is to fix a click bug..
    //http://stackoverflow.com/questions/24078524/svg-click-events-not-firing-bubbling-when-using-use-element

    height: 120
  };
}
export default Labels;

const DrawLabelGroup = withHover(function({
  hoverActions = {},
  hoverProps = {},
  label,
  labelAndSublabels,
  fontWidth,
  // fontHeight,
  outerRadius,
  circularViewWidthVsHeightRatio,
  condenseOverflowingXLabels,
  hoveredId,
  // labelIds,
  multipleLabels
  // isIdHashmap,
}) {
  let { text = "Unlabeled" } = label;
  let groupLabelXStart;
  const { hovered, className } = hoverProps;
  //Add the number of unshown labels
  if (label.labelAndSublabels && label.labelAndSublabels.length > 1) {
    // if (label.x > 0) {
    text = "+" + (label.labelAndSublabels.length - 1) + "," + text;
    // } else {
    //   text += ', +' + (label.labelAndSublabels.length - 1)
    // }
  }

  let labelLength = text.length * fontWidth;
  let maxLabelLength = labelAndSublabels.reduce(function(
    currentLength,
    { text = "Unlabeled" }
  ) {
    if (text.length > currentLength) {
      return text.length;
    }
    return currentLength;
  },
  0);

  let maxLabelWidth = maxLabelLength * fontWidth;
  let labelOnLeft = label.x < 0;
  let labelXStart = label.x - (labelOnLeft ? labelLength : 0);
  if (condenseOverflowingXLabels) {
    let distancePastBoundary =
      Math.abs(label.x + (labelOnLeft ? -labelLength : labelLength)) -
      (outerRadius + 90) * Math.max(1, circularViewWidthVsHeightRatio);
    // Math.max(outerRadius (circularViewWidthVsHeightRatio / 2 + 80));
    if (distancePastBoundary > 0) {
      let numberOfCharsToChop = Math.ceil(distancePastBoundary / fontWidth) + 2;
      //   if (numberOfCharsToChop > text.length) numberOfCharsToChop = text.length
      //label overflows the boundaries!
      text = text.slice(0, -numberOfCharsToChop) + "..";
      groupLabelXStart =
        labelXStart +
        (labelOnLeft ? distancePastBoundary : -distancePastBoundary);
      labelXStart += labelOnLeft ? distancePastBoundary : 0;
    }
  }
  let dy = 20;
  let textYStart = label.y + dy / 2;

  //if label xStart or label xEnd don't fit within the canvas, we need to shorten the label..

  let content;
  const labelClass = " veLabelText veCircularViewLabelText clickable ";

  if ((multipleLabels || groupLabelXStart !== undefined) && hovered) {
    //HOVERED: DRAW MULTIPLE LABELS IN A RECTANGLE
    window.isLabelGroupOpen = true;
    let hoveredLabel;
    if (groupLabelXStart !== undefined) {
      labelXStart = groupLabelXStart;
    }
    labelAndSublabels.some(function(label) {
      if (label.id === hoveredId) {
        hoveredLabel = label;
        return true;
      }
      return false;
    });
    if (!hoveredLabel) {
      hoveredLabel = label;
    }
    let labelYStart = label.y;

    let labelGroupHeight = labelAndSublabels.length * dy;
    let labelGroupBottom = label.y + labelGroupHeight;
    // var numberOfLabelsToFitAbove = 0
    if (labelGroupBottom > outerRadius + 20) {
      // var diff = labelGroupBottom - (outerRadius+10)
      //calculate new label y start if necessary (the group is too long)
      labelYStart -= (label.labelAndSublabels.length - 1) * dy;
      if (labelYStart < -outerRadius) {
        //we need to make another row of labels!
      }
    }

    let line = LabelLine(
      [
        hoveredLabel.innerPoint,
        hoveredLabel.labelAndSublabels &&
        hoveredLabel.labelAndSublabels.length > 0
          ? hoveredLabel.outerPoint
          : {},
        label
      ],
      { style: { opacity: 1 } }
    );
    content = [
      line,
      <g zIndex={10} className={className + " topLevelLabelGroup"} key="gGroup">
        <rect
          onMouseOver={cancelFn}
          zIndex={10}
          x={labelXStart - 4}
          y={labelYStart - dy / 2}
          width={maxLabelWidth + 24}
          height={labelGroupHeight + 4}
          fill="white"
          stroke="black"
        />
        <text zIndex={11} x={labelXStart} y={labelYStart} style={{}}>
          {labelAndSublabels.map(function(label, index) {
            return (
              <DrawGroupInnerLabel
                isSubLabel
                key={"labelItem" + index}
                doNotTriggerOnMouseOut
                className={(label.className || "") + labelClass}
                id={label.id}
                {...{ labelXStart, label, fontWidth, index, dy }}
              />
            );
          })}
        </text>
      </g>
    ];
  } else {
    //DRAW A SINGLE LABEL
    content = [
      <title key="labeltitle">{label.title || label.text}</title>,
      <text
        key="text"
        x={labelXStart}
        textLength={text.length * fontWidth}
        lengthAdjust="spacing"
        className={
          labelClass + label.className + (hovered ? " veAnnotationHovered" : "")
        }
        y={textYStart}
        style={{
          fill: label.color || "black"
          // stroke: label.color ? label.color : "black"
        }}
      >
        {text}
      </text>,
      LabelLine(
        [label.innerPoint, label.outerPoint, label],
        hovered ? { style: { opacity: 1 } } : {}
      )
    ];
  }
  return (
    <g
      {...hoverActions}
      {...{
        onClick: label.onClick,
        onContextMenu: label.onContextMenu || noop
      }}
    >
      {content}
    </g>
  );
});

function LabelLine(pointArray, options) {
  let points = "";
  pointArray.forEach(function({ x, y }) {
    if (!x) return;
    points += `${x},${y} `;
  });
  return (
    <polyline
      {...{
        key: "polyline",
        points,
        stroke: "black",
        fill: "none",
        strokeWidth: 1,
        style: {
          opacity: 0.2
        },
        className: "veLabelLine",
        ...options
      }}
    />
  );
}

const DrawGroupInnerLabel = pureNoFunc(
  withHover(
    ({
      hoverActions,
      hoverProps: { className },
      labelXStart,
      label,
      fontWidth,
      index,
      dy
    }) => {
      return (
        <tspan
          x={labelXStart}
          textLength={label.text.length * fontWidth}
          lengthAdjust="spacing"
          onClick={label.onClick}
          onContextMenu={label.onContextMenu}
          dy={index === 0 ? dy / 2 : dy}
          style={{ fill: label.color ? label.color : "black" }}
          {...hoverActions}
          className={className}
        >
          {label.text}
        </tspan>
      );
    }
  )
);
function noop() {}

const DrawGroupedLabels = pureNoFunc(
  connect((state, { editorName }) => {
    let editorState = state.VectorEditor[editorName] || {};
    let hoveredId = editorState.hoveredAnnotation;
    return {
      hoveredId
    };
  })(function DrawGroupedLabels({
    groupedLabels,
    circularViewWidthVsHeightRatio,
    fontWidth,
    fontHeight,
    condenseOverflowingXLabels,
    outerRadius,
    hoveredId
  }) {
    const hoveredIndex = groupedLabels.findIndex(
      l =>
        l.id === hoveredId ||
        l.labelAndSublabels.some(l2 => l2.id === hoveredId)
    );
    if (hoveredIndex !== -1) {
      const hoveredLabel = groupedLabels[hoveredIndex];
      groupedLabels.splice(hoveredIndex, 1);
      groupedLabels.push(hoveredLabel);
    }

    return groupedLabels.map(function(label, index) {
      let { labelAndSublabels } = label;
      let labelIds = {};
      labelAndSublabels.forEach(label => {
        labelIds[label.id] = true;
      });
      let multipleLabels = labelAndSublabels.length > 1;
      return (
        <DrawLabelGroup
          key={label.id}
          id={labelIds}
          {...{
            label,
            isLabelGroup: true,
            passHoveredId: true,
            // ...rest,
            className: "DrawLabelGroup",
            multipleLabels,
            labelAndSublabels,
            labelIds,
            circularViewWidthVsHeightRatio,
            fontWidth,
            fontHeight,
            condenseOverflowingXLabels,
            outerRadius
          }}
        />
      );
    });
  })
);
function cancelFn(e) {
  e.stopPropagation();
}
