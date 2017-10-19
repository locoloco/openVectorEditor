import {convertRangeTo1Based} from 've-range-utils';
import getReverseComplementSequenceString
  from "ve-sequence-utils/getReverseComplementSequenceString";
import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import Clipboard from "clipboard";
import basicContext from "basiccontext";
import "basiccontext/dist/basicContext.min.css";
import "basiccontext/dist/themes/default.min.css";
import { createReducer } from "redux-act";
import without from "lodash/without";
// import * as caretPositionActions from "./caretPosition";
// import * as selectionLayerActions from "./selectionLayer";
// import sequenceSelector from "../selectors/sequenceSelector";
// import sequenceLengthSelector from "../selectors/sequenceLengthSelector";
// //./caretPosition.js
// import updateSelectionOrCaret
//   from "../../utils/selectionAndCaretUtils/updateSelectionOrCaret";
// import createAction from "./utils/createMetaAction";

// import bindActionCreatorsWithMeta from "./utils/bindActionCreatorsWithMeta";
// ------------------------------------
// Actions
// ------------------------------------
// export const anno = createAction('VE_ANNOTATION_CLICK')


// // ------------------------------------
// // Thunks
// // ------------------------------------
// export function cutsiteClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

export function featureClicked({event, annotation}) {
  event.preventDefault();
  event.stopPropagation();
  const {annotationSelect, annotationDeselectAll} = this.props
  annotationDeselectAll(undefined)
  annotationSelect(annotation)
}

// export function featureRightClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     const editorName = meta.editorName
//     const editorState = getState().VectorEditor[editorName];
//     const { readOnly } = editorState;

//     let items = [
//       ...readOnly ? [] : [{
//         title: "Create Feature",
//         fn: function() {
//           dispatch({
//             type: "TG_SHOW_MODAL",
//             name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
//             props: {
//               editorName,
//               dialogProps: {
//                 title: 'Edit Feature'
//               },
//               initialValues: {
//                 ...convertRangeTo1Based(annotation)
//               }
//             }
//           });
//         }
//       }],
//       {
//         title: "View Translation",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "CREATE_TRANSLATION",
//             meta,
//             payload: {
//               start: annotation.start,
//               end: annotation.end,
//               forward: annotation.forward
//             }
//           });
//         }
//       }
//     ];

//     basicContext.show(items, event);
//   };
// }

// export function primerClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

// export function primerRightClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, /* getState */) {
//     let items = [
//       {
//         title: "View Translation",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "CREATE_TRANSLATION",
//             meta,
//             payload: {
//               start: annotation.start,
//               end: annotation.end,
//               forward: annotation.forward
//             }
//           });
//         }
//       }
//     ];
//     basicContext.show(items, event);
//   };
// }

// export function orfClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

// export function translationClicked({ event, codonRange, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation: codonRange, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     // dispatch(annotationSelect(annotation, meta))
//   };
// }

// export function translationRightClicked(
//   { event, codonRange, annotation },
//   meta
// ) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, /* getState */) {
//     if (annotation.isOrf) {
//       return;
//     }
//     let items = [
//       {
//         title: "Delete Translation",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "DELETE_TRANSLATION",
//             meta,
//             payload: annotation
//           });
//         }
//       }
//     ];
//     basicContext.show(items, event);
//   };
// }

// export function translationDoubleClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

// export function deletionLayerClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

// export function deletionLayerRightClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, /* getState */) {
//     let items = [
//       {
//         title: "Remove Deletion",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "DELETION_LAYER_DELETE",
//             meta,
//             payload: { ...annotation }
//           });
//         }
//       }
//     ];

//     basicContext.show(items, event);
//   };
// }

// export function replacementLayerClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     let args = { event, annotation, meta, dispatch, getState };
//     updateSelectionOrCaretBasedOnAnnotation(args);
//     dispatch(annotationDeselectAll(undefined, meta));
//     dispatch(annotationSelect(annotation, meta));
//   };
// }

// export function replacementLayerRightClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, /* getState */) {
//     let items = [
//       {
//         title: "Remove Edit",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "REPLACEMENT_LAYER_DELETE",
//             meta,
//             payload: { ...annotation }
//           });
//         }
//       }
//     ];

//     basicContext.show(items, event);
//   };
// }

// export function selectionLayerRightClicked(
//   { event, annotation, extraItems = [] },
//   meta
// ) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, getState) {
//     const editorName = meta.editorName
//     const editorState = getState().VectorEditor[editorName];
//     const sequence = sequenceSelector(editorState);
//     const { selectionLayer, readOnly } = editorState;
//     const selectedSeq = getSequenceWithinRange(selectionLayer, sequence);
    
//     function makeTextCopyable(stringToCopy) {
//       let text = "";
//       document.querySelector('.basicContext').addEventListener('copy', (e) => {
//         console.log('eT:',e)
//       })
      
//       let clipboard = new Clipboard(".basicContext", {
//         text: function() {
//           document.addEventListener('copy', (e) => {
            
//           })
//           return stringToCopy;
//         }
//       });
//       clipboard.on("success", function(e) {
//         document.removeEventListener('copy')
//         if (text.length === 0) {
//           console.log("No Sequence To Copy");
//         } else {
//           console.log("Selection Copied!");
//         }
//       });
//       clipboard.on("error", function() {
//         console.error("Error copying selection.");
//       });
//     }
//     let items = [
//       {
//         title: "Copy",
//         fn: function() {
//           console.log('selectedSeq:',selectedSeq)
//           makeTextCopyable(selectedSeq);
//         }
//       },
//       {
//         title: "Copy Reverse Complement",
//         fn: function() {
//           makeTextCopyable(getReverseComplementSequenceString(selectedSeq));
//         }
//       },
//       ...readOnly ? [] : [{
//         title: "Create Feature",
//         fn: function() {
//           dispatch({
//             type: "TG_SHOW_MODAL",
//             name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
//             props: {
//               editorName,
//               dialogProps: {
//                 title: 'Add Feature'
//               }
//             }
//           });
//         }
//       }],
//       {
//         title: "View Translation",
//         fn: function() {
//           dispatch({
//             type: "CREATE_TRANSLATION",
//             meta,
//             payload: { ...annotation, forward: true }
//           });
//         }
//       },
//       {
//         title: "View Reverse Translation",
//         fn: function() {
//           dispatch({
//             type: "CREATE_TRANSLATION",
//             meta,
//             payload: { ...annotation, forward: false }
//           });
//         }
//       },
//       ...extraItems

//       // { title: 'Reset Login', icon: 'ion-person', fn: clicked },
//       // { title: 'Help', icon: 'ion-help-buoy', fn: clicked },
//       // { },
//       // { title: 'Disabled', icon: 'ion-minus-circled', fn: clicked, disabled: true },
//       // { title: 'Invisible', icon: 'ion-eye-disabled', fn: clicked, visible: false },
//       // { title: 'Logout', icon: 'ion-log-out', fn: clicked }
//     ];

//     basicContext.show(items, event);
//   };
// }

// export function orfRightClicked({ event, annotation }, meta) {
//   event.preventDefault();
//   event.stopPropagation();
//   return function(dispatch, /* getState */) {
//     let items = [
//       {
//         title: "View Translation",
//         icon: "ion-plus-round",
//         fn: function() {
//           dispatch({
//             type: "CREATE_TRANSLATION",
//             meta,
//             payload: {
//               start: annotation.start,
//               end: annotation.end,
//               forward: annotation.forward
//             }
//           });
//         }
//       }
//     ];
//     basicContext.show(items, event);
//   };
// }

// export function updateSelectionOrCaretBasedOnAnnotation({
//   event = {},
//   annotation = {},
//   meta,
//   dispatch,
//   getState
// }) {
//   let shiftHeld = event.shiftKey;
//   let newRangeOrCaret = annotation.caretPosition > -1
//     ? annotation.caretPosition
//     : annotation.annotationType === "cutsite"
//         ? annotation.topSnipPosition
//         : { start: annotation.start, end: annotation.end };
//   let {
//     selectionLayerUpdate,
//     caretPositionUpdate
//   } = bindActionCreatorsWithMeta(
//     {
//       ...annotationSelectionActions,
//       ...caretPositionActions,
//       ...selectionLayerActions
//     },
//     dispatch,
//     meta
//   );
//   let editorState = getState().VectorEditor[meta.editorName];
//   let { caretPosition, selectionLayer } = editorState;
//   let sequenceLength = sequenceLengthSelector(editorState);
//   updateSelectionOrCaret({
//     shiftHeld,
//     sequenceLength,
//     newRangeOrCaret,
//     caretPosition,
//     selectionLayer,
//     selectionLayerUpdate,
//     caretPositionUpdate
//   });
// }

// annotationDeselectAll()
// annotationSelect(feature)

// export function cutsiteClicked(event, cutsite, meta, options = {}) {
// 	var args1 = arguments
// 	var shiftHeld = event.shiftKey

// 	return function (dispatch, getState) {
// 		var actions = bindActionCreatorsWithMeta({ ...annotationSelectionActions,...caretPositionActions, ...selectionLayerActions}, dispatch, meta)
// 		var {selectionLayerUpdate,
// 			caretPositionUpdate,
// 			annotationSelect,
// 			annotationDeselectAll
// 		} = actions

// 		var editorState = getState().VectorEditor[meta]
// 		var {caretPosition, selectionLayer} = editorState
// 		var sequenceLength = sequenceLengthSelector(editorState)
// 		var updateSelectionOrCaretArgs = {shiftHeld, sequenceLength, newCaret, caretPosition, selectionLayer, selectionLayerUpdate, caretPositionUpdate}
// 		if (options.doSomethingDifferent) {
// 			options.doSomethingDifferent({...arguments, args1, meta, cutsite, editorState, ...actions, ...updateSelectionOrCaretArgs })
// 		} else {
// 			annotationDeselectAll()
// 			annotationSelect(cutsite)
// 			updateSelectionOrCaret(updateSelectionOrCaretArgs)
// 		}

// 	}
// }