/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */U: () => (/* binding */processImages),
  /* harmony export */w: () => (/* binding */hydrateSelectedContext)
  /* harmony export */
});
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../proto/dist/generated/agent/v1/selected_context_pb.js");
/* harmony import */
var jimp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/jimp@1.6.0/node_modules/jimp/dist/esm/index.js");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 2048;
function getImageMimeType(bytes) {
  // Check the magic numbers
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return "image/webp";
  } else {
    throw new Error("Unsupported image type: supported formats are jpeg, png, gif, or webp.");
  }
}
function processWithSharp(input, maxDimension, maxSizeBytes) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const img = yield jimp__WEBPACK_IMPORTED_MODULE_2__ /* .Jimp */.dK.read(Buffer.from(input));
    // Probe metadata
    let width = (_a = img.width) !== null && _a !== void 0 ? _a : maxDimension;
    let height = (_b = img.height) !== null && _b !== void 0 ? _b : maxDimension;
    // Resize inside bounding box if needed
    if (width > maxDimension || height > maxDimension) {
      img.scaleToFit({
        w: maxDimension,
        h: maxDimension
      });
    }
    // Initial encode as JPEG quality 90
    let out = yield img.getBuffer("image/jpeg", {
      quality: 80
    });
    // If still too big, reduce quality progressively; if needed, further shrink
    let quality = 80;
    let scale = 0.9;
    while (out.length > maxSizeBytes && (quality >= 10 || scale > 0.1)) {
      if (quality >= 10) {
        out = yield img.getBuffer("image/jpeg", {
          quality
        });
        quality -= 10;
        continue;
      }
      // further shrink dimensions if quality floor reached
      width = Math.floor(((_c = img.width) !== null && _c !== void 0 ? _c : maxDimension) * scale);
      height = Math.floor(((_d = img.height) !== null && _d !== void 0 ? _d : maxDimension) * scale);
      img.scaleToFit({
        w: width,
        h: height
      });
      out = yield img.getBuffer("image/jpeg", {
        quality: 90
      });
      scale *= 0.8;
    }
    return {
      bytes: new Uint8Array(out),
      width: (_e = img.width) !== null && _e !== void 0 ? _e : width,
      height: (_f = img.height) !== null && _f !== void 0 ? _f : height
    };
  });
}
const ACTIONS_WITH_SELECTED_CONTEXT = ["userMessageAction", "startPlanAction"];
function includesTyped(arr, el) {
  return arr.includes(el);
}
const hydrateSelectedContext = action => __awaiter(void 0, void 0, void 0, function* () {
  const actionCase = action.action.case;
  // Only hydrate for actions that support selected context
  if (!includesTyped(ACTIONS_WITH_SELECTED_CONTEXT, actionCase)) {
    return;
  }
  const hydratedAction = action.action.value;
  const userMessage = hydratedAction.userMessage;
  // If there's no user message, nothing to hydrate
  if (!userMessage) {
    return;
  }
  const selectedContext = userMessage.selectedContext;
  // If there's no selected context or no images, nothing to hydrate
  if (!selectedContext || selectedContext.selectedImages.length === 0) {
    return;
  }
  // Extract paths from the selected images
  const paths = selectedContext.selectedImages.map(image => image.path).filter(path => !!path);
  if (paths.length === 0) {
    return;
  }
  // Process the images and replace the selected images with processed ones
  const processedImages = yield processImages(paths);
  selectedContext.selectedImages = processedImages;
});
const processImages = paths => __awaiter(void 0, void 0, void 0, function* () {
  const results = yield Promise.allSettled(paths.map(path => __awaiter(void 0, void 0, void 0, function* () {
    const fileBytes = yield node_fs__WEBPACK_IMPORTED_MODULE_0__.promises.readFile(path);
    const processed = yield processWithSharp(new Uint8Array(fileBytes), MAX_DIMENSION, MAX_SIZE_BYTES);
    return new _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_1__ /* .SelectedImage */.d({
      dimension: {
        width: processed.width,
        height: processed.height
      },
      mimeType: getImageMimeType(processed.bytes),
      dataOrBlobId: {
        case: "data",
        value: new Uint8Array(processed.bytes)
      }
    });
  })));
  return results.filter(result => result.status === "fulfilled").map(result => result.value);
});

/***/