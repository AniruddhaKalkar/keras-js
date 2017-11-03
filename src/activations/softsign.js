import ops from 'ndarray-ops'
import cwise from 'cwise'
import Tensor from '../Tensor'

const _softsign = cwise({
  args: ['array'],
  body: function(_x) {
    _x /= 1 + Math.abs(_x)
  }
})

/**
 * In-place operation: softsign activation function
 *
 * @param {Tensor} x
 */
export default function softsign(x) {
  _softsign(x.tensor)
}
