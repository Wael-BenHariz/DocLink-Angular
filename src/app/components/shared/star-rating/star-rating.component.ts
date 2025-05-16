import { Component, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.scss"],
  standalone:false
})
export class StarRatingComponent {
  @Input() rating = 0
  @Input() maxRating = 5
  @Input() readOnly = false
  @Output() ratingChange = new EventEmitter<number>()

  hoverRating = 0

  get stars(): number[] {
    return Array(this.maxRating)
      .fill(0)
      .map((_, i) => i + 1)
  }

  setRating(value: number): void {
    if (!this.readOnly) {
      this.rating = value
      this.ratingChange.emit(this.rating)
    }
  }

  setHoverRating(value: number): void {
    if (!this.readOnly) {
      this.hoverRating = value
    }
  }

  resetHoverRating(): void {
    if (!this.readOnly) {
      this.hoverRating = 0
    }
  }

  getStarClass(star: number): string {
    const currentRating = this.hoverRating || this.rating

    if (currentRating >= star) {
      return "fas fa-star filled"
    } else if (currentRating > star - 1 && currentRating < star) {
      return "fas fa-star-half-alt filled"
    } else {
      return "far fa-star"
    }
  }
}
