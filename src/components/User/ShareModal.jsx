// ShareLinkModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TwitterIcon,
  WhatsappIcon,
  InstapaperShareButton,
} from "react-share";
import {
  FaMeta,
  FaSquareXTwitter,
  FaSquareWhatsapp,
  FaInstagram,
} from "react-icons/fa6";

import axios from "axios";

const ShareLinkModal = ({
  show,
  handleClose,
  shareUrl,
  title,
  content,
  sharedata,
}) => {
  const handleShare = async (platform) => {
    const shareData = {
      articleId: sharedata.articleID.toString(),
      platform: platform,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("https://yourapi.com/api/ShareData", shareData);
    } catch (error) {
      console.error("Error sharing data:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Share this article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-evenly">
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            content={content}
            onClick={() => handleShare("Facebook")}
          >
            <FaMeta size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            content={content}
            onClick={() => handleShare("X")}
          >
            <FaSquareXTwitter size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            content={content}
            onClick={() => handleShare("WhatsApp")}
          >
            <FaSquareWhatsapp size={32} round />
          </WhatsappShareButton>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareLinkModal;
