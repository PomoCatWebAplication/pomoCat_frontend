
type anchorPx = {x : number, y: number, h: number, w: number}

type catMeta = {hat: anchorPx, acc: anchorPx}
const CAT_META: Record<string, catMeta> = {
  "/cats/defaultCat.png": {hat:{x: 0, y: 0, h:0, w:0}, acc:{x: 0, y: 0, h:0, w:0}},
  "/cats/tomatoCat.png": {hat:{x: 0, y: 0, h:0, w:0}, acc:{x: 0, y: 0, h:0, w:0}},
  "/cats/tabbyCat.png": {hat:{x: 0, y: 0, h:0, w:0}, acc:{x: 0, y: 0, h:0, w:0}},
  "/cats/orangeTabbyCat.png": {hat:{x: 0, y: 0, h:0, w:0}, acc:{x: 0, y: 0, h:0, w:0}},
}