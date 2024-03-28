import { Fragment, useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from "react-image-crop";
import { FaUndo, FaRedo, FaCrop } from "react-icons/fa";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./debounceEffect";
import { createPortal } from "react-dom";
import classes from "./ImageCropperModal.module.css";
import "react-image-crop/dist/ReactCrop.css";
import showToast from "../Toast";
import uploadFile from "../serverUploadFile";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const Backdrop = (props) => {
  return <div className={classes.overlay} onClick={props.onClick} />;
};

const ImageCropper = ({
  imageUrl,
  setDisplayProfileImageEditModule,
  setImageUrl,
  setImage,
  image,
  sendUpdateRequest,
  defaultAspect = 16 / 9,
  isCircular = true,
  allowAspectToggle = false,
}) => {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(defaultAspect);
  const [displayPreview, setDisplayPreview] = useState(false);

  const onCancelHandler = () => {
    setDisplayProfileImageEditModule(false);
  };

  useEffect(() => {
    if (image) {
      setCrop(undefined);
    }
  }, [image]);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onCropClick({ imgRef, previewCanvasRef, completedCrop }) {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    // if (hiddenAnchorRef.current) {
    //   hiddenAnchorRef.current.href = blobUrlRef.current;
    //   hiddenAnchorRef.current.click();
    // }
    return {
      file: blob,
      url: URL.createObjectURL(blob),
    };
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const onClickCancel = () => {
    setDisplayProfileImageEditModule(false);
  };

  const onClickPreview = () => {
    setDisplayPreview(true);
  };

  const cropImage = async () => {
    try {
      const { file } = await onCropClick({
        imgRef,
        previewCanvasRef,
        completedCrop,
      });

      const params = {
        canAccessedByPublic: true,
      };

      const { data: response } = await showToast({
        type: "promise",
        message: "Uploading Image",
        promise: uploadFile(file, "image", params),
      });
      setImageUrl(response.url);
      setImage(null);
      await sendUpdateRequest({ photo: response.url });
      setDisplayProfileImageEditModule(false);
    } catch (error) {
      showToast({
        message: error.message || "An error ocurred, please contact support.",
        type: "error",
      });
    }
  };
  return (
    <Fragment>
      {createPortal(<Backdrop onClick={onCancelHandler} />, document.getElementById("backdrop-root"))}
      {createPortal(
        <div className={classes.modal}>
          <div className={!displayPreview ? "" : classes.modalPreviewImage}>
            {!!imageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={200}
                minHeight={200}
                circularCrop={!!isCircular}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageUrl}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>
          <div>
            {!!completedCrop && (
              <div className={!displayPreview ? "flex flex-col items-center pt-2" : classes.modalPreviewImage}>
                <div className="flex flex-row">
                  <button onClick={() => setRotate((prevRotate) => prevRotate - 90)} className="mr-2">
                    <FaUndo className="w-6 h-6" />
                  </button>
                  <input
                    id="scale-input"
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={scale}
                    disabled={!imageUrl}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-32"
                  />
                  <button onClick={() => setRotate((prevRotate) => prevRotate + 90)} className="ml-2">
                    <FaRedo className="w-6 h-6" />
                  </button>
                </div>
                {allowAspectToggle && (
                  <div>
                    <button onClick={handleToggleAspectClick} className="mt-2">
                      <FaCrop className="w-6 h-6" />
                    </button>
                  </div>
                )}
                <div className="flex flex-row mt-2 mb-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={onClickPreview}
                  >
                    Select
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onClickCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {!!completedCrop && (
              <PreviewCanvas
                previewCanvasRef={previewCanvasRef}
                completedCrop={completedCrop}
                hiddenAnchorRef={hiddenAnchorRef}
                displayPreview={displayPreview}
                onClickCancel={onClickCancel}
                cropImage={cropImage}
              ></PreviewCanvas>
            )}
          </div>
        </div>,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};

const PreviewCanvas = ({ previewCanvasRef, completedCrop, cropImage, onClickCancel, displayPreview }) => {
  return (
    <>
      <div className={displayPreview ? classes.previewImage : classes.modalPreviewImage}>
        <canvas
          ref={previewCanvasRef}
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: completedCrop?.width,
            height: completedCrop?.height,
          }}
        />
        <div className="flex flex-row mt-2 mb-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={cropImage}
          >
            Upload
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClickCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
