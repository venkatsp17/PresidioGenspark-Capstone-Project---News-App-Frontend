// ShareLinkModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaMeta, FaSquareXTwitter, FaSquareWhatsapp } from "react-icons/fa6";

import axios from "axios";
import { useAuth } from "../../services/auth.js";
import { useTheme } from "../../services/ThemeContext.jsx";
import { apiUrl } from "../../utils/constants.jsx";

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
      await axios.post(`${apiUrl}/Article/articlesharecount`, shareData, {
        headers: {
          Authorization: `Bearer ${user ? user.token : ""}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data);
    } catch (error) {
      // console.error("Error sharing data:", error);
    }
  };

  const { bgtheme } = useTheme();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className={`bg-${bgtheme}`}>
        <Modal.Title>Share this article</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${bgtheme}`}>
        <div className="d-flex justify-content-evenly">
          <FacebookShareButton
            color={"black"}
            url={shareUrl}
            quote={title}
            content={content}
            onClick={() => handleShare("Facebook")}
          >
            <FaMeta size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            color={"black"}
            url={shareUrl}
            title={title}
            content={content}
            onClick={() => handleShare("X")}
          >
            <FaSquareXTwitter size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton
            color={"black"}
            url={shareUrl}
            title={title}
            content={content}
            onClick={() => handleShare("WhatsApp")}
          >
            <FaSquareWhatsapp size={32} round />
          </WhatsappShareButton>
        </div>
      </Modal.Body>
      <Modal.Footer className={`bg-${bgtheme}`}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareLinkModal;
