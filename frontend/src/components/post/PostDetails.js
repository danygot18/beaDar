import React, { Fragment, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";

import Loader from "../layout/Loader";
import Header from "../layout/Header";
import MetaData from "../layout/MetaData";

import { useDispatch, useSelector } from "react-redux";
import { NEW_REVIEW_RESET } from "../../constants/taroConstants";
import {
  getPostDetails,
  newReview,
  clearErrors,
} from "../../actions/taroAction";
import ListReviews from "../review/ListReviews";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const PostDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );

  const notify = (message = "") =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const addToCart = () => {
    dispatch(addItemToCart(id, quantity));

    notify("Item Added to Cart");
  };

  const dispatch = useDispatch();

  let { id } = useParams();

  const { loading, error, post } = useSelector(
    (state) => state.postDetails
  );

  useEffect(() => {
    dispatch(getPostDetails(id));

    if (error) {
      notify(error);

      dispatch(clearErrors());
    }

    if (reviewError) {
      notify(reviewError);

      dispatch(clearErrors());
    }

    if (success) {
      notify("Review Added Successfully")

      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, error, reviewError, id, success]);

  const increaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= post.stock) return;

    const qty = count.valueAsNumber + 1;

    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;

    setQuantity(qty);
  };

  function setUserRatings() {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.starValue = index + 1;

      ["click", "mouseover", "mouseout"].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, index) => {
        if (e.type === "click") {
          if (index < this.starValue) {
            star.classList.add("orange");

            setRating(this.starValue);
          } else {
            star.classList.remove("orange");
          }
        }

        if (e.type === "mouseover") {
          if (index < this.starValue) {
            star.classList.add("yellow");
          } else {
            star.classList.remove("yellow");
          }
        }

        if (e.type === "mouseout") {
          star.classList.remove("yellow");
        }
      });
    }
  }

  const reviewHandler = () => {
    const formData = new FormData();

    formData.set("rating", rating);

    formData.set("comment", comment);

    formData.set("PostId", id);

    dispatch(newReview(formData));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Header /><br/><br/>
          <div class="container">
            <MetaData title={post.title} />

            <div className="row d-flex justify-content-around">
              <div className="col-12 col-lg-5 img-fluid" id="post_image">
                <Carousel pause="hover">
                  {post.images &&
                    post.images.map((image) => (
                      <Carousel.Item key={image.public_id}>
                        <img
                          className="d-block w-100"
                          src={image.url}
                          alt={post.title}
                        />
                      </Carousel.Item>
                    ))}
                </Carousel>
              </div>

              <div className="col-12 col-lg-5 mt-5">
                <h3>{post.name}</h3>

                <p id="post_id">Post # {post._id}</p>

                <hr />

                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${(post.ratings / 5) * 100}%` }}
                  ></div>
                </div>

                <span id="no_of_reviews">({post.numOfReviews} Reviews)</span>

                <hr />

                <p id="post_price">${post.price}</p>

                <div className="stockCounter d-inline">
                  <span className="btn btn-danger minus" onClick={decreaseQty}>
                    -
                  </span>

                  <input
                    type="number"
                    className="form-control count d-inline"
                    value={quantity}
                    readOnly
                  />

                  <span className="btn btn-primary plus" onClick={increaseQty}>
                    +
                  </span>
                </div>

                <button
                  type="button"
                  id="cart_btn"
                  className="btn btn-primary d-inline ml-4"
                  disabled={post.stock === 0}
                  onClick={addToCart}
                >
                  Add to Cart
                </button>

                <hr />

                <p>
                  Status:{" "}
                  <span
                    id="stock_status"
                    className={post.stock > 0 ? "greenColor" : "redColor"}
                  >
                    {post.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>

                <p>{post.description}</p>

                <hr />

                <p id="post_seller mb-3">
                  Sold by: <strong>{post.seller}</strong>
                </p>

                {user ? (
                  <button
                    id="review_btn"
                    type="button"
                    className="btn btn-primary mt-4"
                    data-toggle="modal"
                    data-target="#ratingModal"
                    onClick={setUserRatings}
                  >
                    Submit Your Review
                  </button>
                ) : (
                  <div className="alert alert-danger mt-5" type="alert">
                    Login to post your review.
                  </div>
                )}

                <div className="row mt-2 mb-5">
                  <div className="rating w-50">
                    <div
                      className="modal fade"
                      id="ratingModal"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="ratingModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="ratingModalLabel">
                              Submit Review
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <ul className="stars">
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                            </ul>

                            <textarea
                              name="review"
                              id="review"
                              className="form-control mt-3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>

                            <button
                              className="btn my-3 float-right review-btn px-4 text-white"
                              onClick={reviewHandler}
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {post.reviews && post.reviews.length > 0 && (
              <ListReviews reviews={post.reviews} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
export default PostDetails;
