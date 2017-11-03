import ops from 'ndarray-ops'
import cwise from 'cwise'
import Tensor from '../Tensor'

const _sigmoid = cwise({
  args: ['array'],
  body: function(_x) {
    _x = 1 / (1 + Math.exp(-_x))
  }
})

/**
 * In-place operation: sigmoid activation function
 *
 * @param {Tensor} x
 */
export default function sigmoid(x) {
  _sigmoid(x.tensor)
}
