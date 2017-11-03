import Layer from '../../Layer'
import Tensor from '../../Tensor'
import ops from 'ndarray-ops'

/**
 * Cropping2D layer class
 */
export default class Cropping2D extends Layer {
  /**
   * Creates a Cropping2D layer
   *
   * @param {Object} [attrs] - layer config attributes
   * @param {number|number[]|number[][]} [attrs.cropping] - int, or tuple of 2 ints, or tuple of 2 tuples of 2 ints
   * @param {string} [attrs.data_format] - either 'channels_last' or 'channels_first'
   */
  constructor(attrs = {}) {
    super(attrs)
    this.layerClass = 'Cropping2D'

    const { cropping = [[0, 0], [0, 0]], data_format = 'channels_last' } = attrs

    if (Array.isArray(cropping)) {
      if (Array.isArray(cropping[0])) {
        // [[int, int], [int, int]]
        this.cropping = cropping
      } else {
        // [int, int]
        this.cropping = [[cropping[0], cropping[0]], [cropping[1], cropping[1]]]
      }
    } else {
      // int
      this.cropping = [[cropping, cropping], [cropping, cropping]]
    }

    this.dataFormat = data_format
  }

  /**
   * Method for layer computational logic
   *
   * @param {Tensor} x
   * @returns {Tensor}
   */
  call(x) {
    // convert to channels_last ordering
    if (this.dataFormat === 'channels_first') {
      x.tensor = x.tensor.transpose(1, 2, 0)
    }

    const inputShape = x.tensor.shape
    const outputShape = [
      inputShape[0] - this.cropping[0][0] - this.cropping[0][1],
      inputShape[1] - this.cropping[1][0] - this.cropping[1][1],
      inputShape[2]
    ]
    let y = new Tensor([], outputShape)
    ops.assign(
      y.tensor,
      x.tensor
        .hi(inputShape[0] - this.cropping[0][1], inputShape[1] - this.cropping[1][1], inputShape[2])
        .lo(this.cropping[0][0], this.cropping[1][0], 0)
    )
    x.tensor = y.tensor

    // convert back to channels_first ordering if necessary
    if (this.dataFormat === 'channels_first') {
      x.tensor = x.tensor.transpose(2, 0, 1)
    }

    return x
  }
}
