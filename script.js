// 顶部导航：移动端展开与关闭。
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// 图片容错：图片不存在时显示占位。头像使用圆形占位，普通截图使用卡片占位。
document.querySelectorAll("img.asset-image").forEach((image) => {
  image.addEventListener("error", () => {
    const heroFallback = image.dataset.fallback === "hero-cover"
      ? image.parentElement.querySelector(".hero-cover")
      : null;

    if (heroFallback) {
      image.hidden = true;
      heroFallback.hidden = false;
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.className = image.hasAttribute("data-avatar")
      ? "avatar-placeholder"
      : "image-placeholder";
    placeholder.textContent = image.dataset.fallbackText || "图片待补充";
    image.replaceWith(placeholder);
  }, { once: true });
});

// 视频容错：工作流演示视频不存在时，显示说明占位。
document.querySelectorAll("video.workflow-video").forEach((video) => {
  const placeholder = video.parentElement?.querySelector(".video-placeholder");
  if (!placeholder) return;

  video.addEventListener("loadeddata", () => {
    placeholder.hidden = true;
    video.hidden = false;
  }, { once: true });

  video.addEventListener("error", () => {
    video.hidden = true;
    placeholder.hidden = false;
  }, { once: true });
});

// 对标账号轮播：每次只展示一个博主研究卡。
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  };

  prev?.addEventListener("click", () => showSlide(activeIndex - 1));
  next?.addEventListener("click", () => showSlide(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

  showSlide(0);
});

// 页面滚动时模块轻微淡入。
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

// 导航高亮：根据当前滚动位置提示所在模块。
const sectionIds = ["hero", "about", "featured", "projects", "workflow", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navItems = document.querySelectorAll(".nav-links a");

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sections.forEach((section) => activeObserver.observe(section));

// v2 兜底：即使 IntersectionObserver 在某些浏览器或本地预览状态下没有触发，
// 也不要让核心内容长期保持透明。
window.setTimeout(() => {
  document.querySelectorAll(".reveal").forEach((section) => {
    section.classList.add("visible");
  });
}, 600);
