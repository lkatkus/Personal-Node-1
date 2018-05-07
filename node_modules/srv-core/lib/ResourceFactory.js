"use strict";

/**
 * Base factory class for all pooled resources.
 * Implementations of this class will be used as factories for 'generic-pool'.
 * Implementation should overwrite {@link ResourceFactory.create} for new resource creation
 * and {@link ResourceFactory.destroy} for destroing resource.
 * {@link ResourceFactory.validate} can be overridden when resources are tested on borrowing.
 */
class ResourceFactory {

    /**
     * Returns <code>Promise</code> which resolves with newly created resource
     * or is rejected with resource creation error.
     *
     * @return {Promise} for creating new resource
     */
    create() {
        return new Promise(function(resolve, reject) {
            return resolve({});
        });
    }

    /**
     * Returns <code>Promise</code> which resolves when resource is destroyed.
     *
     * @param {*} resource - Resource to be destroyed
     * @return {Promise} for destroying specified resource
     */
    destroy(resource) {
        return new Promise(function(resolve) {
            return resolve();
        });
    }

    /**
     * Returns <code>Promise</code> which resolves to <code>true</code> if specified resource is valid
     * and resolves to <code>false</code> if specified resource is invalid.
     * This implementation always resolves to <code>true</code>.
     *
     * @param {*} resource - Resource to be tested
     * @return {Promise} for testing specified resource
     */
    validate(resource) {
        return new Promise(function(resolve) {
            return resolve(true);
        });
    }

}

module.exports = ResourceFactory;
