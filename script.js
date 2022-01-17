const screen_height = document.documentElement.clientHeight / 100;
const screen_width = document.documentElement.clientWidth / 100;

const gallery = document.querySelector(".gallery");
const gallery_style = window.getComputedStyle(gallery);
const gridAutoRowsHeight = parseInt(
  gallery_style.getPropertyValue("grid-auto-rows")
);
const gridRowGap = parseInt(gallery_style.getPropertyValue("gap"));
const gridRowTotalHeight = gridAutoRowsHeight + gridRowGap;

const page_mask = document.querySelector("#page-mask");

window.addEventListener("load", () => {
  [...gallery.children].forEach((gallery_child) => {
    let [artwork_title, artwork] = [...gallery_child.children];
    let artwork_rect = artwork.getBoundingClientRect();
    let scale_factor = artwork.naturalWidth / artwork_rect.width;
    let scaled_height = artwork.naturalHeight / scale_factor;
    let gallery_child_height =
      scaled_height + artwork_title.offsetHeight + gridRowGap;
    let gallery_child_height_in_rows = Math.ceil(
      gallery_child_height / gridRowTotalHeight
    );

    if (
      gallery_child_height_in_rows * gridRowTotalHeight -
        (artwork_rect.height + scaled_height) <
      2 * gridRowTotalHeight
    ) {
      gallery_child_height_in_rows += 2;
    }
    gallery_child.style.gridRowEnd = "span " + gallery_child_height_in_rows;

    artwork.addEventListener("click", () => {
      // Get artwork bounding rect after setting to absolute because
      // when absolute, the image moves to the top of its container gallery_item,
      // giving inaccurate values which leads to bonked translation.
      artwork.style.width = artwork_rect.width + "px";
      artwork.style.position = "absolute";

      artwork_rect = artwork.getBoundingClientRect();

      const magnification_factor = (90 * screen_height) / scaled_height;
      const top_padding = 5 * screen_height;
      const distance_from_top_edge =
        artwork_rect.top -
        (artwork.offsetHeight * (magnification_factor - 1)) / 2;

      const translationY_distance = distance_from_top_edge - top_padding;
      console.log(distance_from_top_edge);
      const translateY_percent =
        -(
          translationY_distance /
          (artwork_rect.height * magnification_factor)
        ) * 100;

      console.log(translateY_percent);

      const left_padding = 3 * screen_width;
      const distance_from_left_edge =
        artwork_rect.left -
        (artwork_rect.width * (magnification_factor - 1)) / 2;
      const translationX_distance = distance_from_left_edge - left_padding;
      const translateX_percent = -(
        (translationX_distance / (artwork_rect.width * magnification_factor)) *
        100
      );

      anime({
        targets: artwork,
        scale: magnification_factor,
        translateX: translateX_percent + "%",
        translateY: translateY_percent + "%",
        easing: "easeOutExpo",
      });

      page_mask.style.zIndex = 2;
      anime({ targets: page_mask, opacity: [0, 0.85], easing: "easeOutExpo" });
    });
  });
});
