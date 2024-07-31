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
import { FaMeta, FaSquareXTwitter, FaSquareWhatsapp } from "react-icons/fa6";

import axios from "axios";
import { useAuth } from "../../services/auth";

const ShareLinkModal = ({
  show,
  handleClose,
  shareUrl,
  title,
  content,
  sharedata,
}) => {
  const { user } = useAuth();
  const handleShare = async (platform) => {
    const shareData = {
      articleId: sharedata.articleID.toString(),
      platform: platform,
      timestamp: new Date().toISOString(),
      userid: user ? user.userID : 0,
    };

    try {
      const response = await axios.post(
        "https://localhost:7285/api/Article/articlesharecount",
        shareData,
        {
          headers: {
            Authorization: `Bearer ${user ? user.token : ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
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
